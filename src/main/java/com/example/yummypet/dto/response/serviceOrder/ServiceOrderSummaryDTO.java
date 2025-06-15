package com.example.yummypet.dto.response.serviceOrder;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ServiceOrderSummaryDTO {
    private Integer id;
    private LocalDateTime createdAt;
    private BigDecimal totalAmount;
    private String status;
    private String paymentMethod;
}
