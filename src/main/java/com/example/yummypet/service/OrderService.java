package com.example.yummypet.service;

import com.example.yummypet.dto.request.OrderCreateRequest;
import com.example.yummypet.dto.request.OrderItemRequest;
import com.example.yummypet.dto.request.OrderUpdateRequest;
import com.example.yummypet.dto.response.OrderStatisticsResponse;
import com.example.yummypet.entity.*;
import com.example.yummypet.enums.*;
import com.example.yummypet.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final VoucherRepository voucherRepository;
    private final ProductRepository productRepository;
    private final PetRepository petRepository;
    private final ServiceRepository serviceRepository;
    private final EmployeeRepository employeeRepository;
    private final OrderItemRepository orderItemRepository;

    private final CodeGeneratorService codeGeneratorService;
    private final LoyaltyPointService loyaltyPointService;
    private final InventoryService inventoryService;
    private final VoucherService voucherService;

    @Transactional
    public Order createOrder(OrderCreateRequest request) {

        Customer customer = null;
        boolean isGuestOrder = false;

        if (request.getCustomerId() != null) {
            customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new EntityNotFoundException("Khách hàng không tồn tại"));

            if (!customer.getIsActive()) {
                throw new IllegalArgumentException("Khách hàng đã bị vô hiệu hóa");
            }

            log.info("Creating in-store order for registered customer: {}", request.getCustomerId());
        } else {
            // Đơn hàng cho khách vãng lai
            isGuestOrder = true;

            if (request.getGuestName() != null && !request.getGuestName().trim().isEmpty()) {
                log.info("Creating in-store order for guest customer: {}", request.getGuestName());
            } else {
                log.info("Creating in-store order for anonymous guest customer");
            }
        }
        Order order = new Order();
        order.setOrderCode(codeGeneratorService.generateOrderCode());
        if (customer != null) {
            // Khách hàng đã đăng ký
            order.setCustomer(customer);
            order.setLoyaltyPointsUsed(request.getLoyaltyPointsUsed());
            order.setIsGuestOrder(false);
        } else {
            // Đơn hàng khách vãng lai

            if (request.getGuestName() != null && !request.getGuestName().trim().isEmpty()) {
                order.setGuestName(request.getGuestName());
            } else {
                // Khách vãng lai ẩn danh
                order.setGuestName("Khách vãng lai");
            }

            order.setGuestPhone(request.getGuestPhone());

            order.setIsGuestOrder(true);

            order.setLoyaltyPointsUsed(0);
        }

        order.setPaymentMethod(request.getPaymentMethod());
        order.setDeliveryAddress("Yummy Store");
        order.setDeliveryMethod(DeliveryMethod.pickup);
        order.setNotes(request.getNotes());
        order.setOrderSource(OrderSource.in_store);
        order.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        order.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

        if (request.getVoucherId() != null) {
            Voucher voucher = voucherRepository.findById(request.getVoucherId())
                    .orElseThrow(() -> new EntityNotFoundException("Voucher không tồn tại"));

            if (!voucherService.isVoucherValid(voucher)) {
                throw new IllegalArgumentException("Voucher không hợp lệ hoặc đã hết hạn");
            }
            order.setVoucher(voucher);
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        for (OrderItemRequest itemRequest : request.getItems()) {
            BigDecimal itemTotal = itemRequest.getUnitPrice()
                    .multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            subtotal = subtotal.add(itemTotal);
        }

        order.setSubtotal(subtotal);

        BigDecimal discountAmount = BigDecimal.ZERO;
        if (order.getVoucher() != null) {
            discountAmount = voucherService.calculateDiscount(order.getVoucher(), subtotal);
        }

        BigDecimal loyaltyDiscount = BigDecimal.ZERO;
        if (request.getLoyaltyPointsUsed() > 0) {
            if (customer.getLoyaltyPoints() < request.getLoyaltyPointsUsed()) {
                throw new IllegalArgumentException("Điểm tích lũy không đủ");
            }
            loyaltyDiscount = loyaltyPointService.calculateLoyaltyDiscount(request.getLoyaltyPointsUsed());
        }

        BigDecimal totalDiscount = discountAmount.add(loyaltyDiscount);
        order.setDiscountAmount(totalDiscount);
        order.setTotalAmount(subtotal.subtract(totalDiscount));

        Order savedOrder = orderRepository.save(order);

        for (OrderItemRequest itemRequest : request.getItems()) {
            createOrderItem(savedOrder, itemRequest);
        }

        if (request.getLoyaltyPointsUsed() > 0) {
            loyaltyPointService.deductLoyaltyPoints(customer, request.getLoyaltyPointsUsed(), savedOrder);
        }

        if (savedOrder.getVoucher() != null) {
            voucherService.incrementVoucherUsage(savedOrder.getVoucher());
        }

        log.info("Order created successfully with code: {}", savedOrder.getOrderCode());
        return savedOrder;
    }

    private void createOrderItem(Order order, OrderItemRequest request) {
        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setItemType(request.getItemType());
        orderItem.setQuantity(request.getQuantity());
        orderItem.setUnitPrice(request.getUnitPrice());
        orderItem.setTotalPrice(request.getUnitPrice().multiply(BigDecimal.valueOf(request.getQuantity())));
        orderItem.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        switch (request.getItemType()) {
            case product -> {
                Product product = productRepository.findById(request.getProductId())
                        .orElseThrow(() -> new EntityNotFoundException("Sản phẩm không tồn tại"));

                if (!product.getIsActive()) {
                    throw new IllegalArgumentException("Sản phẩm đã ngừng kinh doanh");
                }

                if (product.getStockQuantity() < request.getQuantity()) {
                    throw new IllegalArgumentException("Số lượng sản phẩm không đủ");
                }

                orderItem.setProduct(product);
            }
            case pet -> {
                Pet pet = petRepository.findById(request.getPetId())
                        .orElseThrow(() -> new EntityNotFoundException("Thú cưng không tồn tại"));

                if (!pet.getIsActive() || pet.getStatus() != PetStatus.available) {
                    throw new IllegalArgumentException("Thú cưng không có sẵn để bán");
                }

                orderItem.setPet(pet);
                orderItem.setQuantity(1);
            }
            case service -> {
                com.example.yummypet.entity.Service service = serviceRepository.findById(request.getServiceId())
                        .orElseThrow(() -> new EntityNotFoundException("Dịch vụ không tồn tại"));

                if (!service.getIsActive()) {
                    throw new IllegalArgumentException("Dịch vụ đã ngừng cung cấp");
                }

                orderItem.setService(service);

                // Xử lý thời gian dự kiến hoàn thành dịch vụ
                if (request.getCompletionDate() != null) {
                    orderItem.setCompletionDate(request.getCompletionDate().toLocalDateTime());
                } else {
                    // Tự động tính toán thời gian dự kiến hoàn thành dựa trên thời lượng dịch vụ
                    LocalDateTime now = LocalDateTime.now();

                    int durationMinutes = (request.getEstimatedDuration() != null)
                            ? request.getEstimatedDuration()
                            : (service.getDurationMinutes() != null ? service.getDurationMinutes() : 60); // Mặc định 60
                                                                                                          // phút

                    LocalDateTime estimatedCompletion = now.plusMinutes(durationMinutes);
                    orderItem.setCompletionDate(estimatedCompletion);

                    log.info("Tự động tính thời gian hoàn thành dịch vụ: {} phút, hoàn thành vào {}",
                            durationMinutes, estimatedCompletion);
                }

                orderItem.setServiceNotes(request.getServiceNotes());
                if (request.getAssignedEmployeeId() != null) {
                    Employee employee = employeeRepository.findById(request.getAssignedEmployeeId())
                            .orElseThrow(() -> new EntityNotFoundException("Nhân viên không tồn tại"));
                    orderItem.setAssignedEmployee(employee);
                }

            }
        }

        orderItemRepository.save(orderItem);
    }

    @Transactional(readOnly = true)
    public Order getOrderById(Integer id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn hàng với ID: " + id));
    }

    @Transactional(readOnly = true)
    public Order getOrderByCode(String orderCode) {
        return orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn hàng với mã: " + orderCode));
    }    @Transactional(readOnly = true)
    public Page<Order> getAllOrders(Pageable pageable, Integer customerId, OrderStatus status,
            LocalDate fromDate, LocalDate toDate) {
        // Đảm bảo pageable có sắp xếp theo createdAt giảm dần (mới nhất trước)
        // Ưu tiên sắp xếp từ client, nếu không có thì sử dụng sắp xếp mặc định
        if (pageable.getSort().isEmpty()) {
            pageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt")
            );
        }
        
        return orderRepository.findOrdersWithFilters(customerId, status, fromDate, toDate, pageable);
    }    @Transactional(readOnly = true)
    public Page<Order> getOrdersByCustomerId(Integer customerId, Pageable pageable) {
        // Phương thức repository đã có sẵn sắp xếp OrderByCreatedAtDesc
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId, pageable);
    }

    @Transactional
    public Order updateOrderStatus(Integer orderId, OrderStatus status) {
        Order order = getOrderById(orderId);
        OrderStatus oldStatus = order.getStatus();

        if (oldStatus == status) {
            return order;
        }

        validateStatusTransition(oldStatus, status);

        order.setStatus(status);
        order.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

        if (Boolean.TRUE.equals(order.getIsGuestOrder()) && oldStatus == OrderStatus.pending
                && status == OrderStatus.completed) {

            order.setPaymentStatus(PaymentStatus.paid);
            log.info("Auto-updating payment status to PAID for guest order: {}", order.getOrderCode());
        }

        Order updatedOrder = orderRepository.save(order);

        handleStatusChange(updatedOrder, oldStatus, status);

        log.info("Updated order {} status from {} to {}", order.getOrderCode(), oldStatus, status);
        return updatedOrder;
    }

    private void validateStatusTransition(OrderStatus from, OrderStatus to) {
        switch (from) {
            case pending -> {
                if (to != OrderStatus.confirmed && to != OrderStatus.cancelled && to != OrderStatus.completed) {
                    throw new IllegalArgumentException("Không thể chuyển từ pending sang " + to);
                }
            }
            case confirmed -> {
                if (to != OrderStatus.processing && to != OrderStatus.cancelled) {
                    throw new IllegalArgumentException("Không thể chuyển từ confirmed sang " + to);
                }
            }
            case processing -> {
                if (to != OrderStatus.ready && to != OrderStatus.cancelled) {
                    throw new IllegalArgumentException("Không thể chuyển từ processing sang " + to);
                }
            }
            case ready -> {
                if (to != OrderStatus.completed && to != OrderStatus.cancelled) {
                    throw new IllegalArgumentException("Không thể chuyển từ ready sang " + to);
                }
            }
            case completed, cancelled -> {
                throw new IllegalArgumentException("Không thể thay đổi trạng thái từ " + from);
            }
        }
    }

    private void handleStatusChange(Order order, OrderStatus oldStatus, OrderStatus newStatus) {
        switch (newStatus) {
            case confirmed -> {
                inventoryService.updateInventoryAfterOrder(order);

                updateServiceItemsStatus(order, ServiceStatus.in_progress);
            }
            case processing -> {
            }
            case ready -> {
            }
            case pending -> {
            }
            case completed -> {
                if (Boolean.TRUE.equals(order.getIsGuestOrder()) && oldStatus == OrderStatus.pending) {

                    inventoryService.updateInventoryAfterOrder(order);
                    log.info("Updated inventory for direct completion of guest order: {}", order.getOrderCode());

                    updateServiceItemsStatus(order, ServiceStatus.completed);
                }

                if (order.getPaymentStatus() == PaymentStatus.paid && order.getCustomer() != null) {
                    loyaltyPointService.earnPointsFromOrder(order);
                }

                if (oldStatus != OrderStatus.pending) {
                    updateServiceItemsStatus(order, ServiceStatus.completed);
                }
            }
            case cancelled -> {
                if (oldStatus == OrderStatus.confirmed || oldStatus == OrderStatus.processing) {
                    inventoryService.restoreInventoryAfterCancelOrder(order);
                }
                if (order.getLoyaltyPointsUsed() > 0 && order.getCustomer() != null) {
                    loyaltyPointService.restoreLoyaltyPoints(order.getCustomer(), order.getLoyaltyPointsUsed(), order);
                }

                updateServiceItemsStatus(order, ServiceStatus.cancelled);
            }
        }
    }

    private void updateServiceItemsStatus(Order order, ServiceStatus status) {
        if (order.getOrderItems() == null) {
            return;
        }

        for (OrderItem item : order.getOrderItems()) {
            if (item.getItemType() == ItemType.service) {
                if (item.getServiceStatus() == ServiceStatus.completed ||
                        item.getServiceStatus() == ServiceStatus.cancelled) {
                    continue;
                }

                if (status == ServiceStatus.pending && item.getServiceStatus() == ServiceStatus.in_progress) {
                    continue;
                }

                item.setServiceStatus(status);

                if (status == ServiceStatus.completed) {
                    item.setActualCompletionDate(LocalDateTime.now());
                }

                orderItemRepository.save(item);
                log.info("Updated service item {} status to {}", item.getId(), status);
            }
        }
    }

    @Transactional
    public Order updateOrder(Integer id, OrderUpdateRequest request) {
        Order order = getOrderById(id);

        if (order.getStatus() == OrderStatus.completed || order.getStatus() == OrderStatus.cancelled) {
            throw new IllegalArgumentException("Không thể cập nhật đơn hàng đã hoàn thành hoặc đã hủy");
        }

        if (request.getPaymentMethod() != null) {
            order.setPaymentMethod(request.getPaymentMethod());
        }
        if (StringUtils.hasText(request.getDeliveryAddress())) {
            order.setDeliveryAddress(request.getDeliveryAddress());
        }
        if (request.getDeliveryMethod() != null) {
            order.setDeliveryMethod(request.getDeliveryMethod());
        }
        if (StringUtils.hasText(request.getNotes())) {
            order.setNotes(request.getNotes());
        }

        order.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

        return orderRepository.save(order);
    }

    @Transactional
    public void cancelOrder(Integer id) {
        updateOrderStatus(id, OrderStatus.cancelled);
    }

    @Transactional
    public Order confirmPayment(Integer id) {
        Order order = getOrderById(id);

        if (order.getPaymentStatus() == PaymentStatus.paid) {
            throw new IllegalArgumentException("Đơn hàng đã được thanh toán");
        }

        order.setPaymentStatus(PaymentStatus.paid);
        order.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

        Order updatedOrder = orderRepository.save(order);

        if (updatedOrder.getStatus() == OrderStatus.completed) {
            loyaltyPointService.earnPointsFromOrder(updatedOrder);
        }

        log.info("Payment confirmed for order: {}", order.getOrderCode());
        return updatedOrder;
    }

    @Transactional(readOnly = true)
    public List<Order> getRecentOrders(int limit) {
        return orderRepository.findRecentOrders(limit);
    }

    @Transactional(readOnly = true)
    public Page<Order> getOrdersWithPendingServices(Pageable pageable) {
        return orderRepository.findOrdersWithPendingServices(pageable);
    }

    @Transactional(readOnly = true)
    public OrderStatisticsResponse getOrderStatistics(LocalDate fromDate, LocalDate toDate) {
        if (fromDate == null) {
            fromDate = LocalDate.now().minusDays(30);
        }
        if (toDate == null) {
            toDate = LocalDate.now();
        }

        Long totalOrders = orderRepository.countOrdersByDateRange(fromDate, toDate);
        Long pendingOrders = orderRepository.countOrdersByStatusAndDateRange(OrderStatus.pending, fromDate, toDate);
        Long completedOrders = orderRepository.countOrdersByStatusAndDateRange(OrderStatus.completed, fromDate, toDate);
        Long cancelledOrders = orderRepository.countOrdersByStatusAndDateRange(OrderStatus.cancelled, fromDate, toDate);

        BigDecimal totalRevenue = orderRepository.sumTotalAmountByDateRange(fromDate, toDate);
        if (totalRevenue == null)
            totalRevenue = BigDecimal.ZERO;

        BigDecimal averageOrderValue = totalOrders > 0
                ? totalRevenue.divide(BigDecimal.valueOf(totalOrders), RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        Long totalCustomers = orderRepository.countDistinctCustomersByDateRange(fromDate, toDate);
        Long serviceOrders = orderRepository.countOrdersByItemTypeAndDateRange(ItemType.service, fromDate, toDate);
        Long productOrders = orderRepository.countOrdersByItemTypeAndDateRange(ItemType.product, fromDate, toDate);
        Long petOrders = orderRepository.countOrdersByItemTypeAndDateRange(ItemType.pet, fromDate, toDate);

        return new OrderStatisticsResponse(
                totalOrders, pendingOrders, completedOrders, cancelledOrders,
                totalRevenue, averageOrderValue, totalCustomers,
                serviceOrders, productOrders, petOrders);
    }

    @Transactional
    public Order createOnlineOrder(OrderCreateRequest request) {
        log.info("Creating online order for customer: {}", request.getCustomerId());

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new EntityNotFoundException("Khách hàng không tồn tại"));

        if (!customer.getIsActive()) {
            throw new IllegalArgumentException("Khách hàng đã bị vô hiệu hóa");
        }

        if (!StringUtils.hasText(request.getDeliveryAddress())) {
            throw new IllegalArgumentException("Địa chỉ giao hàng là bắt buộc cho đơn hàng online");
        }

        Order order = new Order();
        order.setOrderCode(codeGeneratorService.generateOrderCode());
        order.setCustomer(customer);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setDeliveryMethod(request.getDeliveryMethod());
        order.setNotes(request.getNotes());
        order.setLoyaltyPointsUsed(request.getLoyaltyPointsUsed());
        order.setOrderSource(OrderSource.online); 
        order.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        order.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

        if (request.getVoucherId() != null) {
            Voucher voucher = voucherRepository.findById(request.getVoucherId())
                    .orElseThrow(() -> new EntityNotFoundException("Voucher không tồn tại"));

            if (!voucherService.isVoucherValid(voucher)) {
                throw new IllegalArgumentException("Voucher không hợp lệ hoặc đã hết hạn");
            }
            order.setVoucher(voucher);
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        for (OrderItemRequest itemRequest : request.getItems()) {
            if (itemRequest.getItemType() == ItemType.service) {
                throw new IllegalArgumentException("Đơn hàng online không thể bao gồm dịch vụ");
            }

            BigDecimal itemTotal = itemRequest.getUnitPrice()
                    .multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            subtotal = subtotal.add(itemTotal);
        }

        order.setSubtotal(subtotal);

        BigDecimal discountAmount = BigDecimal.ZERO;
        if (order.getVoucher() != null) {
            discountAmount = voucherService.calculateDiscount(order.getVoucher(), subtotal);
        }

        BigDecimal loyaltyDiscount = BigDecimal.ZERO;
        if (request.getLoyaltyPointsUsed() > 0) {
            if (customer.getLoyaltyPoints() < request.getLoyaltyPointsUsed()) {
                throw new IllegalArgumentException("Điểm tích lũy không đủ");
            }
            loyaltyDiscount = loyaltyPointService.calculateLoyaltyDiscount(request.getLoyaltyPointsUsed());
        }

        BigDecimal totalDiscount = discountAmount.add(loyaltyDiscount);
        order.setDiscountAmount(totalDiscount);
        order.setTotalAmount(subtotal.subtract(totalDiscount));

        Order savedOrder = orderRepository.save(order);

        for (OrderItemRequest itemRequest : request.getItems()) {
            createOrderItem(savedOrder, itemRequest);
        }

        if (request.getLoyaltyPointsUsed() > 0) {
            loyaltyPointService.deductLoyaltyPoints(customer, request.getLoyaltyPointsUsed(), savedOrder);
        }

        if (savedOrder.getVoucher() != null) {
            voucherService.incrementVoucherUsage(savedOrder.getVoucher());
        }

        log.info("Online order created successfully with code: {}", savedOrder.getOrderCode());
        return savedOrder;
    }

    @Transactional
    public Order createAnonymousOrder(OrderCreateRequest request) {
        log.info("Creating in-store order for anonymous guest");

        Order order = new Order();
        order.setOrderCode(codeGeneratorService.generateOrderCode());

        order.setIsGuestOrder(true);
        order.setGuestName("Khách vãng lai");

        order.setPaymentMethod(request.getPaymentMethod());
        order.setDeliveryMethod(request.getDeliveryMethod());
        order.setNotes(request.getNotes());
        order.setLoyaltyPointsUsed(0); 
        order.setOrderSource(OrderSource.in_store);
        order.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        order.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

        if (request.getVoucherId() != null) {
            Voucher voucher = voucherRepository.findById(request.getVoucherId())
                    .orElseThrow(() -> new EntityNotFoundException("Voucher không tồn tại"));

            if (!voucherService.isVoucherValid(voucher)) {
                throw new IllegalArgumentException("Voucher không hợp lệ hoặc đã hết hạn");
            }
            order.setVoucher(voucher);
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        for (OrderItemRequest itemRequest : request.getItems()) {
            BigDecimal itemTotal = itemRequest.getUnitPrice()
                    .multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            subtotal = subtotal.add(itemTotal);
        }

        order.setSubtotal(subtotal);

        BigDecimal discountAmount = BigDecimal.ZERO;
        if (order.getVoucher() != null) {
            discountAmount = voucherService.calculateDiscount(order.getVoucher(), subtotal);
        }

        order.setDiscountAmount(discountAmount);
        order.setTotalAmount(subtotal.subtract(discountAmount));

        Order savedOrder = orderRepository.save(order);

        for (OrderItemRequest itemRequest : request.getItems()) {
            createOrderItem(savedOrder, itemRequest);
        }

        if (savedOrder.getVoucher() != null) {
            voucherService.incrementVoucherUsage(savedOrder.getVoucher());
        }

        return orderRepository.findById(savedOrder.getId()).orElseThrow();
    }    @Transactional(readOnly = true)
    public Page<Order> getGuestOrders(Pageable pageable) {
        // Đảm bảo pageable có sắp xếp theo createdAt giảm dần (mới nhất trước)
        if (pageable.getSort().isEmpty()) {
            pageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt")
            );
        }
        
        return orderRepository.findByIsGuestOrderTrue(pageable);
    }
}