package com.example.yummypet.dto.response;

import com.example.yummypet.entity.ReturnExchangeItem;
import com.example.yummypet.enums.ConditionStatus;
import com.example.yummypet.enums.ItemType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ReturnExchangeItemDTO {
    private Integer id;
    private ItemType itemType;
    private Integer orderItemId;
    private ProductDTO product;
    private PetDTO pet;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private ConditionStatus conditionStatus;
    private String notes;
    private LocalDateTime createdAt;
    
    public static ReturnExchangeItemDTO fromEntity(ReturnExchangeItem item) {
        if (item == null) {
            return null;
        }
        
        ReturnExchangeItemDTO dto = new ReturnExchangeItemDTO();
        dto.setId(item.getId());
        dto.setItemType(item.getItemType());
        
        if (item.getProduct() != null) {
            dto.setProduct(ProductDTO.fromProduct(item.getProduct()));
        }
        
        if (item.getPet() != null) {
            dto.setPet(PetDTO.fromPet(item.getPet()));
        }
        
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setTotalPrice(item.getTotalPrice());
        dto.setConditionStatus(item.getConditionStatus());
        dto.setNotes(item.getNotes());
        dto.setCreatedAt(item.getCreatedAt() != null ? 
                        item.getCreatedAt().toLocalDateTime() : null);
        
        return dto;
    }
}
