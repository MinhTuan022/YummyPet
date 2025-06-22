package com.example.yummypet.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PetImageRequest {
    @NotBlank(message = "URL hình ảnh không được để trống")
    private String imageUrl;
    
    private String altText;
    
    private Boolean isPrimary = false;
    
    private Integer displayOrder = 0;
}
