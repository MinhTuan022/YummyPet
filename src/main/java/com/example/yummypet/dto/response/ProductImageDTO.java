package com.example.yummypet.dto.response;

import com.example.yummypet.entity.ProductImage;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProductImageDTO {
    private Integer id;
    private Integer productId;
    private String imageUrl;
    private String altText;
    private Boolean isPrimary;
    private Integer displayOrder;
    private LocalDateTime createdAt;
    
    public static ProductImageDTO fromProductImage(ProductImage productImage) {
        ProductImageDTO dto = new ProductImageDTO();
        dto.setId(productImage.getId());
        
        if (productImage.getProduct() != null) {
            dto.setProductId(productImage.getProduct().getId());
        }
        
        dto.setImageUrl(productImage.getImageUrl());
        dto.setAltText(productImage.getAltText());
        dto.setIsPrimary(productImage.getIsPrimary());
        dto.setDisplayOrder(productImage.getDisplayOrder());
        
        if (productImage.getCreatedAt() != null) {
            dto.setCreatedAt(productImage.getCreatedAt().toLocalDateTime());
        }
        
        return dto;
    }
}
