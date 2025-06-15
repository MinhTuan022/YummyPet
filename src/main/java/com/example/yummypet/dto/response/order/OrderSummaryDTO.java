package com.example.yummypet.dto.response.order;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderSummaryDTO {
    private Integer id;
    private LocalDateTime createdAt;
    private String deliveryMethod;
    private BigDecimal totalAmount;
    private String status;
    private Integer totalItems;
}