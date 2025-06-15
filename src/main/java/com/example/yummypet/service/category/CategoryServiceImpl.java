package com.example.yummypet.service.category;

import com.example.yummypet.dto.request.category.CategoryRequestDTO;
import com.example.yummypet.dto.response.category.CategoryResponseDTO;
import com.example.yummypet.entity.Category;
import com.example.yummypet.repository.CategoryRepository;
import com.example.yummypet.util.CategoryNotFoundException;
import com.example.yummypet.util.DuplicateCategoryNameException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public CategoryResponseDTO createCategory(CategoryRequestDTO requestDto) {
        // Kiểm tra tên danh mục đã tồn tại
        if (categoryRepository.findByNameIgnoreCase(requestDto.getName()).isPresent()) {
            throw new DuplicateCategoryNameException("Tên danh mục '" + requestDto.getName() + "' đã tồn tại");
        }

        Category category = new Category();
        category.setName(requestDto.getName().trim());
        category.setDescription(requestDto.getDescription().trim());
        category.setIsActive(requestDto.getIsActive());

        Category savedCategory = categoryRepository.save(category);
        return mapToResponseDto(savedCategory);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponseDTO getCategoryById(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Không tìm thấy danh mục có ID: " + id));
        return mapToResponseDto(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponseDTO> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponseDTO> getActiveCategoriesOnly() {
        return categoryRepository.findByIsActiveTrue()
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CategoryResponseDTO> searchCategories(String keyword, Pageable pageable) {
        return categoryRepository.findByKeyword(keyword, pageable)
                .map(this::mapToResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CategoryResponseDTO> getCategoriesByStatus(Boolean isActive, Pageable pageable) {
        return categoryRepository.findByIsActive(isActive, pageable)
                .map(this::mapToResponseDto);
    }

    @Override
    public CategoryResponseDTO updateCategory(Integer id, CategoryRequestDTO requestDto) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Không tìm thấy danh mục có ID: " + id));

        // Kiểm tra tên danh mục đã tồn tại (trừ category hiện tại)
        if (categoryRepository.existsByNameIgnoreCaseAndIdNot(requestDto.getName(), id)) {
            throw new DuplicateCategoryNameException("Tên danh mục '" + requestDto.getName() + "' đã tồn tại");
        }

        existingCategory.setName(requestDto.getName().trim());
        existingCategory.setDescription(requestDto.getDescription().trim());
        existingCategory.setIsActive(requestDto.getIsActive());

        Category updatedCategory = categoryRepository.save(existingCategory);
        return mapToResponseDto(updatedCategory);
    }

    @Override
    public void deleteCategory(Integer id) {
        if (!categoryRepository.existsById(id)) {
            throw new CategoryNotFoundException("Không tìm thấy danh mục có ID: " + id);
        }
        categoryRepository.deleteById(id);
    }

    @Override
    public void toggleCategoryStatus(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Không tìm thấy danh mục có ID: " + id));

        category.setIsActive(!category.getIsActive());
        categoryRepository.save(category);
    }

    private CategoryResponseDTO mapToResponseDto(Category category) {
        CategoryResponseDTO dto = new CategoryResponseDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setIsActive(category.getIsActive());
        dto.setCreatedAt(category.getCreatedAt());
        return dto;
    }
}