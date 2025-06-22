package com.example.yummypet.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoyaltyPointsResponse {
    private Integer customerId;
    private String customerCode;
    private String fullName;
    private Integer previousPoints;
    private Integer currentPoints;
    private Integer change;
}
