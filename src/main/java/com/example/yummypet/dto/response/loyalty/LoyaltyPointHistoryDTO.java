package com.example.yummypet.dto.response.loyalty;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LoyaltyPointHistoryDTO {
    private Integer id;
    private LocalDateTime createdAt;
    private String description;
    private Integer pointsEarned;
    private Integer pointsUsed;
}
