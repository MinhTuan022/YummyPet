package com.example.yummypet.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesStatisticsDTO {
    private BigDecimal totalRevenue;
    private BigDecimal monthlyRevenue;
    private BigDecimal dailyRevenue;
    private Long totalOrders;
    private Long monthlyOrders;
    private Long dailyOrders;
    private BigDecimal averageOrderValue;
    private BigDecimal growthRate;
}
