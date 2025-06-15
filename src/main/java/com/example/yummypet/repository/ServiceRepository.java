package com.example.yummypet.repository;

import com.example.yummypet.entity.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {

    List<Service> findByIsActiveTrue();

    Page<Service> findByIsActiveTrue(Pageable pageable);

    Optional<Service> findByNameIgnoreCase(String name);

    @Query("SELECT s FROM Service s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Service> findByNameContainingIgnoreCase(@Param("name") String name);

    List<Service> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    List<Service> findByDurationMinutesBetween(Integer minDuration, Integer maxDuration);

    @Query("SELECT s FROM Service s WHERE s.isActive = true AND s.price BETWEEN :minPrice AND :maxPrice")
    List<Service> findActiveServicesByPriceRange(@Param("minPrice") BigDecimal minPrice,
                                                 @Param("maxPrice") BigDecimal maxPrice);

    @Query("SELECT s FROM Service s WHERE " +
            "(:name IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:isActive IS NULL OR s.isActive = :isActive) AND " +
            "(:minPrice IS NULL OR s.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR s.price <= :maxPrice)")
    Page<Service> findServicesWithFilters(@Param("name") String name,
                                          @Param("isActive") Boolean isActive,
                                          @Param("minPrice") BigDecimal minPrice,
                                          @Param("maxPrice") BigDecimal maxPrice,
                                          Pageable pageable);

    boolean existsByNameIgnoreCase(String name);

    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM Service s WHERE LOWER(s.name) = LOWER(:name) AND s.id != :id")
    boolean existsByNameIgnoreCaseAndIdNot(@Param("name") String name, @Param("id") Long id);
}
