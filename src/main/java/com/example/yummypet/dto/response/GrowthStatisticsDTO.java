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
public class GrowthStatisticsDTO {
    private BigDecimal revenueGrowthPercentage;
    private BigDecimal revenueGrowthAmount;
    
    private Double orderGrowthPercentage;
    private Long orderGrowthAmount;
    
    private Double customerGrowthPercentage;
    private Long customerGrowthAmount;
    
    private BigDecimal currentMonthRevenue;
    private BigDecimal previousMonthRevenue;
    private Long currentMonthOrders;
    private Long previousMonthOrders;
    private Long currentMonthCustomers;
    private Long previousMonthCustomers;
}
