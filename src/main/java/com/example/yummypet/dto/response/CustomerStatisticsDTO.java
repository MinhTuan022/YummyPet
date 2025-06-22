package com.example.yummypet.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerStatisticsDTO {
    private Long totalCustomers;
    private Long newCustomersThisMonth;
    private Long activeCustomers; // Khách hàng có đơn hàng trong 30 ngày qua
    private Long loyalCustomers; // Khách hàng có >= 3 đơn hàng
    private Integer averageLoyaltyPoints;
    private Long totalLoyaltyPointsIssued;
    private Long totalLoyaltyPointsRedeemed;
}
