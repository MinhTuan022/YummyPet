package com.example.yummypet.repository;

import com.example.yummypet.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

//
@Repository
public interface ProductRepository extends JpaRepository<Product, Integer>, JpaSpecificationExecutor<Product> {

    List<Product> findByNameContainingIgnoreCase(String name);


    List<Product> findByCategoryId(Integer categoryId);


    List<Product> findByIsActiveTrue();

    List<Product> findByIsPetTrue();
    List<Product> findByIsPetFalse();

    boolean existsByBarcodeAndIdNot(String name, Integer id);
    boolean existsByBarcode(String barcode);
    boolean existsBySkuAndIdNot(String name, Integer id);
    boolean existsBySku(String sku);
    List<Product> findByStockQuantityLessThan(Integer quantity);

    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.stockQuantity > 0")
    List<Product> findAvailableProducts();

    @Query("SELECT p FROM Product p WHERE " +
            "(p.name LIKE %:keyword% OR p.description LIKE %:keyword% OR p.breed LIKE %:keyword%) " +
            "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
            "AND (:isActive IS NULL OR p.isActive = :isActive)")
    Page<Product> searchProducts(@Param("keyword") String keyword,
                                 @Param("categoryId") Integer categoryId,
                                 @Param("isActive") Boolean isActive,
                                 Pageable pageable);
}