package com.example.yummypet.dto.request.order;

import com.example.yummypet.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOrderStatusRequestDTO
{
    @NotNull
    private OrderStatus newStatus;
    private String notes;
}



