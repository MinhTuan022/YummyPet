package com.example.yummypet.dto.request;

import com.example.yummypet.enums.DeliveryMethod;
import com.example.yummypet.enums.PaymentMethod;
import lombok.Data;

@Data
public class OrderUpdateRequest {
    private PaymentMethod paymentMethod;
    private DeliveryMethod deliveryMethod;
    private String deliveryAddress;
    private String notes;
}
