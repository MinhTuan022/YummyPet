package com.example.yummypet.dto.request;

import com.example.yummypet.enums.ItemType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemRequest {
    @NotNull(message = "Loại mặt hàng không được để trống")
    private ItemType itemType;
    
    @NotNull(message = "Giá đơn vị không được để trống")
    private BigDecimal unitPrice;
    
    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    private Integer quantity;
      // For product items
    private Integer productId;
    
    // For pet items (khi mua/bán thú cưng)
    private Integer petId;
}
