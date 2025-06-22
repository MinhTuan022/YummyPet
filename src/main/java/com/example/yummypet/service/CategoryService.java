package com.example.yummypet.service;

import com.example.yummypet.dto.request.CategoryRequest;
import com.example.yummypet.entity.Category;
import com.example.yummypet.enums.CategoryType;
import com.example.yummypet.repository.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    
    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Page<Category> getCategories(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }
      @Transactional(readOnly = true)
    public List<Category> getCategoriesByType(CategoryType type) {
        return categoryRepository.findByCategoryType(type);
    }
    
    @Transactional(readOnly = true)
    public List<Category> getTopLevelCategories() {
        return categoryRepository.findByParentIsNull();
    }
    
    @Transactional(readOnly = true)
    public List<Category> getSubcategories(Integer parentId) {
        return categoryRepository.findByParentId(parentId);
    }
    
    @Transactional(readOnly = true)
    public Category getCategoryById(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Danh mục không tồn tại với ID: " + id));
    }
    
    @Transactional
    public Category createCategory(CategoryRequest request) {
        Optional<Category> existingCategory = categoryRepository.findByName(request.getName());
        if (existingCategory.isPresent()) {
            throw new IllegalArgumentException("Danh mục với tên '" + request.getName() + "' đã tồn tại");
        }
        
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setCategoryType(request.getCategoryType());
        category.setIsActive(request.getIsActive());
        
        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new EntityNotFoundException("Danh mục cha không tồn tại với ID: " + request.getParentId()));
            
            if (parent.getCategoryType() != request.getCategoryType()) {
                throw new IllegalArgumentException("Loại danh mục con phải giống với loại danh mục cha");
            }
            
            category.setParent(parent);
        }
        
        Timestamp now = new Timestamp(System.currentTimeMillis());
        category.setCreatedAt(now);
        category.setUpdatedAt(now);
        
        return categoryRepository.save(category);
    }
    
    @Transactional
    public Category updateCategory(Integer id, CategoryRequest request) {
        Category category = getCategoryById(id);
        
        Optional<Category> existingWithSameName = categoryRepository.findByName(request.getName());
        if (existingWithSameName.isPresent() && !existingWithSameName.get().getId().equals(id)) {
            throw new IllegalArgumentException("Danh mục với tên '" + request.getName() + "' đã tồn tại");
        }
        
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setCategoryType(request.getCategoryType());
        category.setIsActive(request.getIsActive());
        
        if (request.getParentId() != null) {
            if (request.getParentId().equals(id)) {
                throw new IllegalArgumentException("Không thể đặt danh mục làm cha của chính nó");
            }
            
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new EntityNotFoundException("Danh mục cha không tồn tại với ID: " + request.getParentId()));
            
            if (parent.getCategoryType() != request.getCategoryType()) {
                throw new IllegalArgumentException("Loại danh mục con phải giống với loại danh mục cha");
            }
            
            category.setParent(parent);
        } else {
            category.setParent(null);
        }
        
        category.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        
        return categoryRepository.save(category);
    }
    
    @Transactional
    public void deleteCategory(Integer id) {
        Category category = getCategoryById(id);

        
        categoryRepository.delete(category);
    }
    
    @Transactional
    public Category toggleCategoryStatus(Integer id) {
        Category category = getCategoryById(id);
        category.setIsActive(!category.getIsActive());
        category.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        return categoryRepository.save(category);
    }
}
