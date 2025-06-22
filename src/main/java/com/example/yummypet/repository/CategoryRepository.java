package com.example.yummypet.repository;

import com.example.yummypet.entity.Category;
import com.example.yummypet.enums.CategoryType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Optional<Category> findByName(String name);
    
    List<Category> findByCategoryType(CategoryType categoryType);
    
    Page<Category> findByCategoryType(CategoryType categoryType, Pageable pageable);
    
    List<Category> findByParentId(Integer parentId);
    
    List<Category> findByParentIsNull();
    
    boolean existsByParentId(Integer parentId);
    
    List<Category> findByIsActive(boolean isActive);
    
    Page<Category> findByIsActive(boolean isActive, Pageable pageable);
}
