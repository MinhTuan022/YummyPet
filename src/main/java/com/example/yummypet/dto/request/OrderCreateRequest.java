package com.example.yummypet.dto.request;

import com.example.yummypet.enums.DeliveryMethod;
import com.example.yummypet.enums.PaymentMethod;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class OrderCreateRequest { 
    private Integer customerId;
    
    // Thông tin khách vãng lai
    private String guestName;
    private String guestPhone;
    
    @NotNull(message = "Phương thức thanh toán không được để trống")
    private PaymentMethod paymentMethod;
    
    private DeliveryMethod deliveryMethod;
    
    private String deliveryAddress;
    
    private String notes;
    
    private Integer voucherId;
    
    private Integer loyaltyPointsUsed = 0;
    
    @NotEmpty(message = "Đơn hàng phải có ít nhất một sản phẩm")
    private List<OrderItemRequest> items;
}
