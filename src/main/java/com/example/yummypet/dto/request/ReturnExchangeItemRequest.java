package com.example.yummypet.dto.request;

import com.example.yummypet.enums.ConditionStatus;
import com.example.yummypet.enums.ItemType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReturnExchangeItemRequest {
    
    @NotNull(message = "ID mục đơn hàng không được để trống")
    private Integer orderItemId;
    
    @NotNull(message = "Loại mục không được để trống")
    private ItemType itemType;
    
    private Integer productId; // Chỉ dùng khi itemType là PRODUCT
    
    private Integer petId; // Chỉ dùng khi itemType là PET
    
    @NotNull(message = "Số lượng đổi trả không được để trống")
    @Min(value = 1, message = "Số lượng đổi trả phải ít nhất là 1")
    private Integer quantity;
    
    @NotNull(message = "Tình trạng sản phẩm không được để trống")
    private ConditionStatus conditionStatus;
    
    private String notes;
}
