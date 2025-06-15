package com.example.yummypet.dto.request.order;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ReturnExchangeRequestDTO {
    @NotNull
    private Integer orderId;

    @NotNull
    private String reason;

    private String description;

    @NotNull
    private List<ReturnItemRequest> returnItems;

    @Data
    public static class ReturnItemRequest {
        @NotNull
        private Integer orderItemId;

        @NotNull
        private Integer quantity;
    }
}