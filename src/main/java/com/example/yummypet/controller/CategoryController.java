package com.example.yummypet.controller;

import com.example.yummypet.dto.common.ApiResponse;
import com.example.yummypet.dto.request.category.CategoryRequestDTO;
import com.example.yummypet.dto.response.category.CategoryResponseDTO;
import com.example.yummypet.service.category.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponseDTO>> createCategory(
            @Valid @RequestBody CategoryRequestDTO requestDto) {
        CategoryResponseDTO category = categoryService.createCategory(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo danh mục thành công", category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponseDTO>> getCategoryById(@PathVariable Integer id) {
        CategoryResponseDTO category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh mục thành công", category));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponseDTO>>> getAllCategories() {
        List<CategoryResponseDTO> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách danh mục thành công", categories));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<CategoryResponseDTO>>> getActiveCategories() {
        List<CategoryResponseDTO> categories = categoryService.getActiveCategoriesOnly();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách danh mục hoạt động thành công", categories));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<CategoryResponseDTO>>> searchCategories(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<CategoryResponseDTO> categories = categoryService.searchCategories(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm danh mục thành công", categories));
    }

    @GetMapping("/status/{isActive}")
    public ResponseEntity<ApiResponse<Page<CategoryResponseDTO>>> getCategoriesByStatus(
            @PathVariable Boolean isActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<CategoryResponseDTO> categories = categoryService.getCategoriesByStatus(isActive, pageable);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh mục theo trạng thái thành công", categories));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponseDTO>> updateCategory(
            @PathVariable Integer id,
            @Valid @RequestBody CategoryRequestDTO requestDto) {
        CategoryResponseDTO category = categoryService.updateCategory(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật danh mục thành công", category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Integer id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa danh mục thành công", null));
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<Void>> toggleCategoryStatus(@PathVariable Integer id) {
        categoryService.toggleCategoryStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Thay đổi trạng thái danh mục thành công", null));
    }
}
