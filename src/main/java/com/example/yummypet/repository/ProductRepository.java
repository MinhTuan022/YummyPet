package com.example.yummypet.repository;

import com.example.yummypet.dto.response.ProductStatisticsDTO;
import com.example.yummypet.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    Optional<Product> findBySku(String sku);
    
    Optional<Product> findByBarcode(String barcode);
    
    @Query("SELECT p FROM Product p WHERE " +
           "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:brand IS NULL OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :brand, '%'))) AND " +
           "(:isActive IS NULL OR p.isActive = :isActive)")
    Page<Product> findByFilters(
            @Param("name") String name, 
            @Param("categoryId") Integer categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("brand") String brand,
            @Param("isActive") Boolean isActive,
            Pageable pageable);
      List<Product> findByCategoryId(Integer categoryId);
    
    Page<Product> findByCategoryId(Integer categoryId, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.stockQuantity <= p.minStockLevel AND p.isActive = true")
    List<Product> findProductsBelowMinStock();
    
    @Query("SELECT p FROM Product p WHERE p.stockQuantity = 0 AND p.isActive = true")
    List<Product> findOutOfStockProducts();
    
    @Query("SELECT p FROM Product p WHERE p.expiryDate IS NOT NULL AND p.expiryDate <= :date AND p.isActive = true")
    List<Product> findExpiredProducts(@Param("date") LocalDate date);
    
    @Query(value = "SELECT * FROM products ORDER BY stock_quantity DESC LIMIT :limit", nativeQuery = true)
    List<Product> findTopProducts(@Param("limit") int limit);
    

}
