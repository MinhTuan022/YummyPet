package com.example.yummypet.repository;

import com.example.yummypet.dto.response.ServiceStatisticsDTO;
import com.example.yummypet.entity.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Integer> {
    Optional<Service> findByName(String name);
    
    List<Service> findByIsActive(Boolean isActive);
    
    Page<Service> findByIsActive(Boolean isActive, Pageable pageable);
    
    @Query("SELECT s FROM Service s WHERE " +
            "(:name IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:minPrice IS NULL OR s.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR s.price <= :maxPrice) AND " +
            "(:minDuration IS NULL OR s.durationMinutes >= :minDuration) AND " +
            "(:maxDuration IS NULL OR s.durationMinutes <= :maxDuration) AND " +
            "(:isActive IS NULL OR s.isActive = :isActive)")
    Page<Service> findByFilters(
            @Param("name") String name,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minDuration") Integer minDuration,
            @Param("maxDuration") Integer maxDuration,
            @Param("isActive") Boolean isActive,
            Pageable pageable);
    
    @Query("SELECT s FROM Service s ORDER BY s.price ASC")
    List<Service> findAllOrderByPriceAsc();
    
    @Query("SELECT s FROM Service s ORDER BY s.price DESC")
    List<Service> findAllOrderByPriceDesc();
    
    @Query(value = "SELECT s.* FROM services s " +
            "JOIN order_items oi ON s.id = oi.service_id " +
            "GROUP BY s.id ORDER BY COUNT(oi.id) DESC LIMIT :limit", nativeQuery = true)
    List<Service> findTopBookedServices(@Param("limit") int limit);
    
    /**
     * Tìm thống kê dịch vụ đặt nhiều nhất trong khoảng thời gian
     * Trả về: serviceId, serviceName, totalBookings, revenue
     */
    @Query(value = "SELECT s.id, s.name, COUNT(oi.id) AS total_bookings, SUM(oi.price * oi.quantity) AS total_revenue " +
           "FROM services s " +
           "JOIN order_items oi ON s.id = oi.service_id " +
           "JOIN orders o ON oi.order_id = o.id " +
           "WHERE oi.item_type = 'service' " +
           "AND o.created_at >= :fromDate " +
           "GROUP BY s.id, s.name " +
           "ORDER BY total_bookings DESC " +
           "LIMIT :limit", nativeQuery = true)
    List<Object[]> findTopBookedServicesWithRevenue(@Param("fromDate") LocalDateTime fromDate, @Param("limit") int limit);
}
