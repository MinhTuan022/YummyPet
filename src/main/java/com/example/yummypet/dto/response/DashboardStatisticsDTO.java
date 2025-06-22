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
public class DashboardStatisticsDTO {
    private SalesStatisticsDTO salesStatistics;
    private CustomerStatisticsDTO customerStatistics;
    private Long totalProducts;
    private Long totalServices;
    private Long totalEmployees;
    
    private BigDecimal todayRevenue;
    private Long todayOrders;
    private Long todayNewCustomers;
    
    private ProductStatisticsDTO topSellingProduct;
    private ServiceStatisticsDTO mostBookedService;
}
