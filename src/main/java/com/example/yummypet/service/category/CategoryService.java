package com.example.yummypet.service.category;

import com.example.yummypet.dto.request.category.CategoryRequestDTO;
import com.example.yummypet.dto.response.category.CategoryResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CategoryService {
    CategoryResponseDTO createCategory(CategoryRequestDTO requestDto);
    CategoryResponseDTO getCategoryById(Integer id);
    List<CategoryResponseDTO> getAllCategories();
    List<CategoryResponseDTO> getActiveCategoriesOnly();
    Page<CategoryResponseDTO> searchCategories(String keyword, Pageable pageable);
    Page<CategoryResponseDTO> getCategoriesByStatus(Boolean isActive, Pageable pageable);
    CategoryResponseDTO updateCategory(Integer id, CategoryRequestDTO requestDto);
    void deleteCategory(Integer id);
    void toggleCategoryStatus(Integer id);
}
