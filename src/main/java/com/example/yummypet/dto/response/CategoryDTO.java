package com.example.yummypet.dto.response;

import com.example.yummypet.entity.Category;
import com.example.yummypet.enums.CategoryType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class CategoryDTO {
    private Integer id;
    private String name;
    private String description;
    private Integer parentId;
    private String parentName;
    private CategoryType categoryType;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CategoryDTO fromCategory(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        
        if (category.getParent() != null) {
            dto.setParentId(category.getParent().getId());
            dto.setParentName(category.getParent().getName());
        }
        
        dto.setCategoryType(category.getCategoryType());
        dto.setIsActive(category.getIsActive());
        
        if (category.getCreatedAt() != null) {
            dto.setCreatedAt(category.getCreatedAt().toLocalDateTime());
        }
        
        if (category.getUpdatedAt() != null) {
            dto.setUpdatedAt(category.getUpdatedAt().toLocalDateTime());
        }
        
        return dto;
    }
    
    public static List<CategoryDTO> fromCategories(List<Category> categories) {
        return categories.stream()
                .map(CategoryDTO::fromCategory)
                .collect(Collectors.toList());
    }
}
