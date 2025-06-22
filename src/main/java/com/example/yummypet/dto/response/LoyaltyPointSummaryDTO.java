package com.example.yummypet.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyPointSummaryDTO {
    private Integer customerId;
    private String customerName;
    private Integer currentPoints;
    private Integer totalEarned;
    private Integer totalRedeemed;
    private Integer totalExpired;
    private Integer totalAdjusted;
}
