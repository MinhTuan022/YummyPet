package com.example.yummypet.dto.request.order;

import com.example.yummypet.enums.OrderType;
import com.example.yummypet.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateOrderRequestDTO {
    @NotNull
    private Integer customerId;

    @NotNull
    private OrderType orderType;

    @NotNull
    private PaymentMethod paymentMethod;

//    private DeliveryMethod deliveryMethod;

    private String shippingAddress;

    private String notes;

    private Integer voucherId;

    private Integer employeeId; // For in-store orders

    @NotNull
    private List<OrderItemRequest> orderItems;

    @Data
    public static class OrderItemRequest {
        @NotNull
        private Integer productId;

        @NotNull
        @Positive
        private Integer quantity;

        @NotNull
        @Positive
        private BigDecimal unitPrice;
    }
}
