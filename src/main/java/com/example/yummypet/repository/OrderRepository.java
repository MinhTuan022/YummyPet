package com.example.yummypet.repository;

import com.example.yummypet.dto.response.MonthlySalesDTO;
import com.example.yummypet.entity.Order;
import com.example.yummypet.enums.ItemType;
import com.example.yummypet.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    @Query("SELECT COUNT(o) FROM Order o WHERE DATE(o.createdAt) = CURRENT_DATE")
    int countTodayOrders();

    Optional<Order> findByOrderCode(String orderCode);

    boolean existsByOrderCode(String orderCode);
    
    Page<Order> findByCustomerIdOrderByCreatedAtDesc(Integer customerId, Pageable pageable);
    
    @Query("SELECT o FROM Order o WHERE " +
            "(:customerId IS NULL OR o.customer.id = :customerId) AND " +
            "(:status IS NULL OR o.status = :status) AND " +
            "(:fromDate IS NULL OR CAST(o.createdAt AS LocalDate) >= :fromDate) AND " +
            "(:toDate IS NULL OR CAST(o.createdAt AS LocalDate) <= :toDate)")
    Page<Order> findOrdersWithFilters(
            @Param("customerId") Integer customerId,
            @Param("status") OrderStatus status,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate,
            Pageable pageable);
    
    @Query(value = "SELECT * FROM orders o ORDER BY o.created_at DESC LIMIT :limit", nativeQuery = true)
    List<Order> findRecentOrders(@Param("limit") int limit);
    
    @Query("SELECT DISTINCT o FROM Order o JOIN o.orderItems i WHERE 1=0")
    Page<Order> findOrdersWithPendingServices(Pageable pageable);
    
    @Query("SELECT COUNT(o) FROM Order o " +
            "WHERE CAST(o.createdAt AS LocalDate) >= :fromDate " +
            "AND CAST(o.createdAt AS LocalDate) <= :toDate")
    Long countOrdersByDateRange(
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate);
    
    @Query("SELECT COUNT(o) FROM Order o " +
            "WHERE o.status = :status " +
            "AND CAST(o.createdAt AS LocalDate) >= :fromDate " +
            "AND CAST(o.createdAt AS LocalDate) <= :toDate")
    Long countOrdersByStatusAndDateRange(
            @Param("status") OrderStatus status,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o " +
            "WHERE CAST(o.createdAt AS LocalDate) >= :fromDate " +
            "AND CAST(o.createdAt AS LocalDate) <= :toDate")
    BigDecimal sumTotalAmountByDateRange(
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate);
    
    @Query("SELECT COUNT(DISTINCT o.customer.id) FROM Order o " +
            "WHERE CAST(o.createdAt AS LocalDate) >= :fromDate " +
            "AND CAST(o.createdAt AS LocalDate) <= :toDate")
    Long countDistinctCustomersByDateRange(
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate);
    
    @Query("SELECT COUNT(DISTINCT o.id) FROM Order o JOIN o.orderItems i " +
            "WHERE i.itemType = :itemType " +
            "AND CAST(o.createdAt AS LocalDate) >= :fromDate " +
            "AND CAST(o.createdAt AS LocalDate) <= :toDate")
    Long countOrdersByItemTypeAndDateRange(
            @Param("itemType") ItemType itemType,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate);

    /**
     * Tìm tất cả đơn hàng của khách vãng lai
     */
    Page<Order> findByIsGuestOrderTrue(Pageable pageable);

    // Thống kê methods
    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate")
    Long countByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal sumTotalAmountByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    Long countByStatus(@Param("status") OrderStatus status);
      @Query("SELECT COALESCE(AVG(o.totalAmount), 0) FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal averageOrderValueByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
      // Thống kê doanh thu hàng tháng
    @Query(value = "SELECT " +
           "MONTH(o.created_at) as month, " +
           "CONCAT('Tháng ', MONTH(o.created_at)) as monthName, " +
           "YEAR(o.created_at) as year, " +
           "COUNT(o.id) as orderCount, " +
           "COALESCE(SUM(o.total_amount), 0) as totalRevenue, " +
           "COALESCE(AVG(o.total_amount), 0) as averageOrderValue " +
           "FROM orders o " +
           "WHERE YEAR(o.created_at) = :year " +
           "GROUP BY MONTH(o.created_at), YEAR(o.created_at) " +
           "ORDER BY MONTH(o.created_at)", nativeQuery = true)
    List<Object[]> getMonthlySalesStatisticsRaw(@Param("year") int year);
}

