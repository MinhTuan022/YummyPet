package com.example.yummypet.service;

import com.example.yummypet.dto.request.OrderCreateRequest;
import com.example.yummypet.dto.request.OrderItemRequest;
import com.example.yummypet.entity.*;
import com.example.yummypet.enums.*;
import com.example.yummypet.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceUpdated {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final VoucherRepository voucherRepository;
    private final ProductRepository productRepository;
    private final PetRepository petRepository;
    private final OrderItemRepository orderItemRepository;

    private final CodeGeneratorService codeGeneratorService;
    private final LoyaltyPointService loyaltyPointService;
    private final VoucherService voucherService;

    @Transactional
    public Order createOrder(OrderCreateRequest request) {
        log.info("Creating in-store order");

        Customer customer = null;

        if (request.getCustomerId() != null) {
            customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new EntityNotFoundException("Khách hàng không tồn tại"));

            if (!customer.getIsActive()) {
                throw new IllegalArgumentException("Khách hàng đã bị vô hiệu hóa");
            }

            log.info("Creating in-store order for registered customer: {}", request.getCustomerId());
        } else {
            log.info("Creating in-store order for guest customer: {}", request.getGuestName());

            if (request.getGuestName() == null || request.getGuestName().trim().isEmpty()) {
                throw new IllegalArgumentException("Tên khách vãng lai không được để trống");
            }
        }

        Order order = new Order();
        order.setOrderCode(codeGeneratorService.generateOrderCode());

        // Set thông tin khách hàng (đã đăng ký hoặc khách vãng lai)
        if (customer != null) {
            order.setCustomer(customer);
            order.setLoyaltyPointsUsed(request.getLoyaltyPointsUsed());
        } else {
            // Đơn hàng khách vãng lai
            order.setGuestName(request.getGuestName());
            order.setGuestPhone(request.getGuestPhone());
            order.setIsGuestOrder(true);
            // Khách vãng lai không dùng điểm tích lũy
            order.setLoyaltyPointsUsed(0);
        }

        order.setPaymentMethod(request.getPaymentMethod());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setDeliveryMethod(request.getDeliveryMethod());
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
        if (request.getLoyaltyPointsUsed() != null && request.getLoyaltyPointsUsed() > 0) {
            if (customer == null) {
                throw new IllegalArgumentException("Khách vãng lai không thể sử dụng điểm tích lũy");
            }

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

        if (customer != null) {
            if (request.getLoyaltyPointsUsed() != null && request.getLoyaltyPointsUsed() > 0) {
                loyaltyPointService.deductLoyaltyPoints(customer, request.getLoyaltyPointsUsed(), savedOrder);
            }

            loyaltyPointService.earnPointsFromOrder(savedOrder);
        }

        if (savedOrder.getVoucher() != null) {
            voucherService.incrementVoucherUsage(savedOrder.getVoucher());
        }

        return orderRepository.findById(savedOrder.getId()).orElseThrow();
    }

    @Transactional
    public Order createOnlineOrder(OrderCreateRequest request) {
        if (request.getCustomerId() == null) {
            throw new IllegalArgumentException("Đơn hàng online phải có thông tin khách hàng");
        }

        Order order = createOrder(request);
        order.setOrderSource(OrderSource.online);
        return orderRepository.save(order);
    }

    
    private void createOrderItem(Order order, OrderItemRequest request) {
        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setItemType(request.getItemType());
        orderItem.setQuantity(request.getQuantity());

        // Đảm bảo unitPrice không null trước khi tính toán
        BigDecimal unitPrice = request.getUnitPrice();
        if (unitPrice == null) {
            
            log.warn("Unit price is null for item type: {}. Using default price 0.", request.getItemType());
            unitPrice = BigDecimal.ZERO;
        }

        orderItem.setUnitPrice(unitPrice);
        orderItem.setTotalPrice(unitPrice.multiply(BigDecimal.valueOf(request.getQuantity())));
        orderItem.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        switch (request.getItemType()) {
            case product:
                Product product = productRepository.findById(request.getProductId())
                        .orElseThrow(() -> new EntityNotFoundException("Sản phẩm không tồn tại"));

                if (!product.getIsActive()) {
                    throw new IllegalArgumentException("Sản phẩm đã ngừng kinh doanh");
                }

                if (product.getStockQuantity() < request.getQuantity()) {
                    throw new IllegalArgumentException("Số lượng sản phẩm không đủ");
                }

                orderItem.setProduct(product);
                break;

            case pet:
                Pet pet = petRepository.findById(request.getPetId())
                        .orElseThrow(() -> new EntityNotFoundException("Thú cưng không tồn tại"));

                if (!pet.getIsActive() || pet.getStatus() != PetStatus.available) {
                    throw new IllegalArgumentException("Thú cưng không có sẵn để bán");
                }

                orderItem.setPet(pet);
                orderItem.setQuantity(1); // Pet is always quantity 1
                break;

            default:
                throw new IllegalArgumentException("Loại mặt hàng không được hỗ trợ");
        }
        orderItemRepository.save(orderItem);
    }

    @Transactional
    public Order createAnonymousOrder(OrderCreateRequest request) {
        log.info("Creating in-store order for anonymous guest");

        for (OrderItemRequest itemRequest : request.getItems()) {
            if (itemRequest.getUnitPrice() == null) {
                switch (itemRequest.getItemType()) {
                    case product:
                        if (itemRequest.getProductId() == null) {
                            throw new IllegalArgumentException("Sản phẩm không được để trống");
                        }
                        Product product = productRepository.findById(itemRequest.getProductId())
                                .orElseThrow(() -> new EntityNotFoundException("Sản phẩm không tồn tại"));
                        itemRequest.setUnitPrice(product.getPrice());
                        break;
                    case pet:
                        if (itemRequest.getPetId() == null) {
                            throw new IllegalArgumentException("Thú cưng không được để trống");
                        }
                        Pet pet = petRepository.findById(itemRequest.getPetId())
                                .orElseThrow(() -> new EntityNotFoundException("Thú cưng không tồn tại"));
                        itemRequest.setUnitPrice(pet.getPrice());
                        break;
                    default:
                        throw new IllegalArgumentException("Loại mặt hàng không được hỗ trợ");
                }
                log.info("Auto-filled unit price for item type {} with value {}",
                        itemRequest.getItemType(), itemRequest.getUnitPrice());
            }
        }

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

        log.info("Anonymous order created successfully with code: {}", savedOrder.getOrderCode());
        return savedOrder;
    }
}
