package com.example.yummypet.controller;

import com.example.yummypet.dto.request.CategoryRequest;
import com.example.yummypet.dto.response.ApiResponse;
import com.example.yummypet.dto.response.CategoryDTO;
import com.example.yummypet.entity.Category;
import com.example.yummypet.enums.CategoryType;
import com.example.yummypet.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<CategoryDTO>>> getAllCategories(Pageable pageable) {
        Page<Category> categories = categoryService.getCategories(pageable);
        List<CategoryDTO> categoryDTOs = CategoryDTO.fromCategories(categories.getContent());
        Page<CategoryDTO> categoryDTOPage = new PageImpl<>(categoryDTOs, pageable, categories.getTotalElements());
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Danh sách danh mục", categoryDTOPage));
    }
    
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getAllCategoriesWithoutPaging() {
        List<Category> categories = categoryService.getAllCategories();
        List<CategoryDTO> categoryDTOs = CategoryDTO.fromCategories(categories);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Danh sách tất cả danh mục", categoryDTOs));
    }
      @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getCategoriesByType(@PathVariable CategoryType type) {
        List<Category> categories = categoryService.getCategoriesByType(type);
        List<CategoryDTO> categoryDTOs = CategoryDTO.fromCategories(categories);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Danh sách danh mục theo loại: " + type, categoryDTOs));
    }
    
    @GetMapping("/top-level")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getTopLevelCategories() {
        List<Category> categories = categoryService.getTopLevelCategories();
        List<CategoryDTO> categoryDTOs = CategoryDTO.fromCategories(categories);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Danh sách danh mục cấp cao nhất", categoryDTOs));
    }
    
    @GetMapping("/subcategories/{parentId}")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getSubcategories(@PathVariable Integer parentId) {
        List<Category> categories = categoryService.getSubcategories(parentId);
        List<CategoryDTO> categoryDTOs = CategoryDTO.fromCategories(categories);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Danh sách danh mục con", categoryDTOs));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDTO>> getCategoryById(@PathVariable Integer id) {
        Category category = categoryService.getCategoryById(id);
        CategoryDTO categoryDTO = CategoryDTO.fromCategory(category);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Chi tiết danh mục", categoryDTO));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryDTO>> createCategory(@Valid @RequestBody CategoryRequest request) {
        Category category = categoryService.createCategory(request);
        CategoryDTO categoryDTO = CategoryDTO.fromCategory(category);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Tạo danh mục thành công", categoryDTO));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDTO>> updateCategory(
            @PathVariable Integer id, 
            @Valid @RequestBody CategoryRequest request) {
        Category category = categoryService.updateCategory(id, request);
        CategoryDTO categoryDTO = CategoryDTO.fromCategory(category);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật danh mục thành công", categoryDTO));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Integer id) {
        categoryService.deleteCategory(id);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Xóa danh mục thành công", null));
    }
    
    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<CategoryDTO>> toggleCategoryStatus(@PathVariable Integer id) {
        Category category = categoryService.toggleCategoryStatus(id);
        CategoryDTO categoryDTO = CategoryDTO.fromCategory(category);
        
        String message = category.getIsActive() ? "Danh mục đã được kích hoạt" : "Danh mục đã bị vô hiệu hóa";
        return ResponseEntity.ok(new ApiResponse<>(true, message, categoryDTO));
    }
}
