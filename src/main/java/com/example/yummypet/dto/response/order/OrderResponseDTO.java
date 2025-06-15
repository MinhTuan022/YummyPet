package com.example.yummypet.dto.response.order;

import com.example.yummypet.enums.OrderStatus;
import com.example.yummypet.enums.OrderType;
import com.example.yummypet.enums.PaymentMethod;
import com.example.yummypet.enums.PaymentStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponseDTO {
    private Integer id;
    private String orderCode;
    private OrderType orderType;
    private OrderStatus status;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private String shippingAddress;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private CustomerInfo customer;
    private EmployeeInfo employee;
    private List<OrderItemInfo> orderItems;

    @Data
    public static class CustomerInfo {
        private Integer id;
        private String fullName;
        private String phone;
        private String email;
    }

    @Data
    public static class EmployeeInfo {
        private Integer id;
        private String fullName;
    }

    @Data
    public static class OrderItemInfo {
        private Integer id;
        private Integer productId;
        private String productName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;
    }
}
