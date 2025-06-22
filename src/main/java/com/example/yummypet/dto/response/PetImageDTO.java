package com.example.yummypet.dto.response;

import com.example.yummypet.entity.PetImage;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PetImageDTO {
    private Integer id;
    private Integer petId;
    private String imageUrl;
    private String altText;
    private Boolean isPrimary;
    private Integer displayOrder;
    private LocalDateTime createdAt;
    
    public static PetImageDTO fromPetImage(PetImage petImage) {
        PetImageDTO dto = new PetImageDTO();
        dto.setId(petImage.getId());
        
        if (petImage.getPet() != null) {
            dto.setPetId(petImage.getPet().getId());
        }
        
        dto.setImageUrl(petImage.getImageUrl());
        dto.setAltText(petImage.getAltText());
        dto.setIsPrimary(petImage.getIsPrimary());
        dto.setDisplayOrder(petImage.getDisplayOrder());
        
        if (petImage.getCreatedAt() != null) {
            dto.setCreatedAt(petImage.getCreatedAt().toLocalDateTime());
        }
        
        return dto;
    }
}
