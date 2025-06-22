package com.example.yummypet.dto.request;

import com.example.yummypet.enums.CategoryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryRequest {
    @NotBlank(message = "Tên danh mục không được để trống")
    @Size(max = 100, message = "Tên danh mục không được vượt quá 100 ký tự")
    private String name;
    
    private String description;
    
    private Integer parentId;
    
    @NotNull(message = "Loại danh mục không được để trống")
    private CategoryType categoryType;
    
    private Boolean isActive = true;
}
