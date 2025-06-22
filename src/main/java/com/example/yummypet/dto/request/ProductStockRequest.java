package com.example.yummypet.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductStockRequest {
    @NotNull(message = "ID sản phẩm không được để trống")
    private Integer productId;
    
    @NotNull(message = "Số lượng không được để trống")
    private Integer quantity;
    
    private String note;
}
