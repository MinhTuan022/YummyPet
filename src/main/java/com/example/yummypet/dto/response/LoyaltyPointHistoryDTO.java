package com.example.yummypet.dto.response;

import com.example.yummypet.enums.LoyaltyPointType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyPointHistoryDTO {
    private Integer id;
    private Integer customerId;
    private String customerName;
    private Integer points;
    private LoyaltyPointType type;
    private String typeDescription;
    private Integer orderId;
    private String orderCode;
    private String description;
    private Timestamp createdAt;
}
