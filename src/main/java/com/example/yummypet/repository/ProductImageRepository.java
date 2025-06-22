package com.example.yummypet.repository;

import com.example.yummypet.entity.Product;
import com.example.yummypet.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {
    List<ProductImage> findByProductOrderByDisplayOrderAsc(Product product);
    
    List<ProductImage> findByProductIdOrderByDisplayOrderAsc(Integer productId);
    
    List<ProductImage> findByProductId(Integer productId);
    
    @Query("SELECT pi FROM ProductImage pi WHERE pi.product.id = :productId AND pi.isPrimary = true")
    Optional<ProductImage> findPrimaryImageByProductId(@Param("productId") Integer productId);
    
    void deleteByProductId(Integer productId);
    
    long countByProductId(Integer productId);
}
