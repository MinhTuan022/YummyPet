package com.example.yummypet.service;

import com.example.yummypet.dto.request.order.CreateOrderRequestDTO;
import com.example.yummypet.dto.request.order.ReturnExchangeRequestDTO;
import com.example.yummypet.dto.request.order.UpdateOrderStatusRequestDTO;
import com.example.yummypet.dto.response.order.OrderResponseDTO;
import com.example.yummypet.entity.*;
import com.example.yummypet.enums.DiscountType;
import com.example.yummypet.enums.OrderStatus;
import com.example.yummypet.enums.OrderType;
import com.example.yummypet.enums.PaymentStatus;
import com.example.yummypet.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final EmployeeRepository employeeRepository;
    private final VoucherRepository voucherRepository;
//    private final ReturnExchangeRepository returnExchangeRepository;

    public OrderResponseDTO createOrder(CreateOrderRequestDTO request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại"));

        Employee employee = null;
        if (request.getOrderType() == OrderType.IN_STORE && request.getEmployeeId() != null) {
            employee = employeeRepository.findById(request.getEmployeeId())
                    .orElseThrow(() -> new RuntimeException("Nhân viên không tồn tại"));
        }

        Voucher voucher = null;
        if (request.getVoucherId() != null) {
            voucher = voucherRepository.findById(request.getVoucherId())
                    .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));

            if (!voucher.getIsActive() || voucher.getEndDate().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Voucher đã hết hạn hoặc không còn hiệu lực");
            }
        }

        Order order = new Order();
//        order.setOrderCode(generateOrderCode());
        order.setCustomer(customer);
        order.setEmployee(employee);
        order.setOrderType(request.getOrderType());
        order.setPaymentMethod(request.getPaymentMethod());
//        order.setDeliveryMethod(request.getDeliveryMethod());
        order.setShippingAddress(request.getShippingAddress());
        order.setNotes(request.getNotes());
        order.setVoucher(voucher);

        if (request.getOrderType() == OrderType.ONLINE) {
            order.setStatus(OrderStatus.PENDING);
            order.setPaymentStatus(PaymentStatus.PENDING);
        } else {
            order.setStatus(OrderStatus.COMPLETED);
            order.setPaymentStatus(PaymentStatus.PAID);
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CreateOrderRequestDTO.OrderItemRequest itemRequest : request.getOrderItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại: " + itemRequest.getProductId()));

            // Check stock quantity
            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new RuntimeException("Không đủ số lượng sản phẩm: " + product.getName());
            }

            BigDecimal itemTotal = itemRequest.getUnitPrice().multiply(new BigDecimal(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }

        // Apply discount
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (voucher != null) {
            if (voucher.getDiscountType() == DiscountType.PERCENTAGE) {
                discountAmount = totalAmount.multiply(voucher.getDiscountValue()).divide(new BigDecimal(100));
                if (voucher.getMaxDiscountAmount() != null && discountAmount.compareTo(voucher.getMaxDiscountAmount()) > 0) {
                    discountAmount = voucher.getMaxDiscountAmount();
                }
            } else {
                discountAmount = voucher.getDiscountValue();
            }
        }

        BigDecimal finalAmount = totalAmount.subtract(discountAmount);

        order.setTotalAmount(totalAmount);
        order.setDiscountAmount(discountAmount);
        order.setFinalAmount(finalAmount);

        order = orderRepository.save(order);

        // Create order items and update stock
        for (CreateOrderRequestDTO.OrderItemRequest itemRequest : request.getOrderItems()) {
            Product product = productRepository.findById(itemRequest.getProductId()).get();

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setUnitPrice(itemRequest.getUnitPrice());
            orderItem.setTotalPrice(itemRequest.getUnitPrice().multiply(new BigDecimal(itemRequest.getQuantity())));

            // Update stock quantity
            product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
            productRepository.save(product);
        }

        return convertToOrderResponseDTO(order);
    }

    public OrderResponseDTO updateOrderStatus(Integer orderId, UpdateOrderStatusRequestDTO request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        OrderStatus currentStatus = order.getStatus();
        OrderStatus newStatus = request.getNewStatus();

        // Validate status transition
        if (!isValidStatusTransition(currentStatus, newStatus)) {
            throw new RuntimeException("Không thể chuyển trạng thái từ " + currentStatus.getDescription() +
                    " sang " + newStatus.getDescription());
        }

        order.setStatus(newStatus);
        if (request.getNotes() != null) {
            order.setNotes(order.getNotes() + "\n" + request.getNotes());
        }

        // Update payment status if needed
        if (newStatus == OrderStatus.COMPLETED) {
            order.setPaymentStatus(PaymentStatus.PAID);
        }

        order = orderRepository.save(order);
        return convertToOrderResponseDTO(order);
    }

    public OrderResponseDTO processPayment(Integer orderId, PaymentStatus paymentStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        order.setPaymentStatus(paymentStatus);

        if (paymentStatus == PaymentStatus.PAID && order.getOrderType() == OrderType.ONLINE) {
            // For online orders, move to processing after successful payment
            order.setStatus(OrderStatus.PROCESSING);
        } else if (paymentStatus == PaymentStatus.FAILED) {
            order.setStatus(OrderStatus.CANCELLED);
            // Restore stock quantities
            restoreStockQuantities(order);
        }

        order = orderRepository.save(order);
        return convertToOrderResponseDTO(order);
    }

//    public void createReturnExchange(ReturnExchangeRequestDTO request) {
//        Order order = orderRepository.findById(request.getOrderId())
//                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
//
//        if (order.getStatus() != OrderStatus.COMPLETED) {
//            throw new RuntimeException("Chỉ có thể đổi trả đơn hàng đã hoàn thành");
//        }
//
//        ReturnExchange returnExchange = new ReturnExchange();
//        returnExchange.setOrder(order);
//        returnExchange.setReason(request.getReason());
//        returnExchange.setConditionStatus("PENDING");
//
//        for (ReturnExchangeRequestDTO.ReturnItemRequest returnItem : request.getReturnItems()) {
//            OrderItem orderItem = order.getOrderItems().stream()
//                    .filter(item -> item.getId().equals(returnItem.getOrderItemId()))
//                    .findFirst()
//                    .orElseThrow(() -> new RuntimeException("Order item không tồn tại"));
//
//            if (returnItem.getQuantity() > orderItem.getQuantity()) {
//                throw new RuntimeException("Số lượng đổi trả không được vượt quá số lượng đã mua");
//            }
//
//            returnExchange.setQuantity(returnItem.getQuantity());
//            // Set other return exchange fields as needed
//        }
//
//        returnExchangeRepository.save(returnExchange);
//
//        // Update order status
//        order.setStatus(OrderStatus.RETURN_REQUESTED);
//        orderRepository.save(order);
//    }

    public Page<OrderResponseDTO> getOrdersByCustomer(Integer customerId, Pageable pageable) {
        Page<Order> orders = orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId, pageable);
        return orders.map(this::convertToOrderResponseDTO);
    }

    public Page<OrderResponseDTO> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc(pageable);
        return orders.map(this::convertToOrderResponseDTO);
    }

    public OrderResponseDTO getOrderById(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
        return convertToOrderResponseDTO(order);
    }

    private boolean isValidStatusTransition(OrderStatus current, OrderStatus target) {
        switch (current) {
            case PENDING:
                return target == OrderStatus.PROCESSING || target == OrderStatus.CANCELLED;
            case PROCESSING:
                return target == OrderStatus.DELIVERED || target == OrderStatus.CANCELLED;
            case DELIVERED:
                return target == OrderStatus.COMPLETED;
            case COMPLETED:
                return target == OrderStatus.RETURN_REQUESTED;
            case RETURN_REQUESTED:
                return target == OrderStatus.RETURNED;
            default:
                return false;
        }
    }

    private void restoreStockQuantities(Order order) {
        for (OrderItem orderItem : order.getOrderItems()) {
            Product product = orderItem.getProduct();
            product.setStockQuantity(product.getStockQuantity() + orderItem.getQuantity());
            productRepository.save(product);
        }
    }
//
//    private String generateOrderCode() {
//        return "ORD" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
//    }

    private OrderResponseDTO convertToOrderResponseDTO(Order order) {
        OrderResponseDTO response = new OrderResponseDTO();
        response.setId(order.getId());
        response.setOrderCode(order.getOrderCode());
        response.setOrderType(order.getOrderType());
        response.setStatus(order.getStatus());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setPaymentStatus(order.getPaymentStatus());
        response.setTotalAmount(order.getTotalAmount());
        response.setDiscountAmount(order.getDiscountAmount());
        response.setFinalAmount(order.getFinalAmount());
        response.setShippingAddress(order.getShippingAddress());
        response.setNotes(order.getNotes());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());

        // Set customer info
        if (order.getCustomer() != null) {
            OrderResponseDTO.CustomerInfo customerInfo = new OrderResponseDTO.CustomerInfo();
            customerInfo.setId(order.getCustomer().getId());
            customerInfo.setFullName(order.getCustomer().getFullName());
            customerInfo.setPhone(order.getCustomer().getPhone());
            customerInfo.setEmail(order.getCustomer().getEmail());
            response.setCustomer(customerInfo);
        }

        // Set employee info
        if (order.getEmployee() != null) {
            OrderResponseDTO.EmployeeInfo employeeInfo = new OrderResponseDTO.EmployeeInfo();
            employeeInfo.setId(order.getEmployee().getId());
            employeeInfo.setFullName(order.getEmployee().getFullName());
            response.setEmployee(employeeInfo);
        }

        // Set order items
        if (order.getOrderItems() != null) {
            List<OrderResponseDTO.OrderItemInfo> orderItemInfos = order.getOrderItems().stream()
                    .map(item -> {
                        OrderResponseDTO.OrderItemInfo itemInfo = new OrderResponseDTO.OrderItemInfo();
                        itemInfo.setId(item.getId());
                        itemInfo.setProductId(item.getProduct().getId());
                        itemInfo.setProductName(item.getProduct().getName());
                        itemInfo.setQuantity(item.getQuantity());
                        itemInfo.setUnitPrice(item.getUnitPrice());
                        itemInfo.setTotalPrice(item.getTotalPrice());
                        return itemInfo;
                    })
                    .collect(Collectors.toList());
            response.setOrderItems(orderItemInfos);
        }

        return response;
    }
}
