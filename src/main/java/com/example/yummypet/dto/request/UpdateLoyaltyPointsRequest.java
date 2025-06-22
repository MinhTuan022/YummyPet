package com.example.yummypet.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateLoyaltyPointsRequest {
    @NotNull(message = "Số điểm không được để trống")
    private Integer points;
}
