package com.example.yummypet.repository;

import com.example.yummypet.entity.OrderItem;
import com.example.yummypet.enums.ItemType;
import com.example.yummypet.enums.ServiceStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    List<OrderItem> findByOrderId(Integer orderId);


    @Query(value = "SELECT p.id, p.name, c.name AS category_name, SUM(oi.quantity) AS total_quantity, " +
            "SUM(oi.unit_price * oi.quantity) AS total_revenue " +
            "FROM order_items oi " +
            "JOIN products p ON oi.product_id = p.id " +
            "JOIN categories c ON p.category_id = c.id " +
            "JOIN orders o ON oi.order_id = o.id " +
            "WHERE oi.item_type = 'product' " +
            "AND o.created_at >= :fromDate " +
            "GROUP BY p.id, p.name, c.name " +
            "ORDER BY total_quantity DESC", nativeQuery = true)
    List<Object[]> findTopSellingProducts(@Param("fromDate") LocalDateTime fromDate, Pageable pageable);

 
    @Query(value = "SELECT s.id, s.name, " +
            "COUNT(oi.id) AS total_bookings, " +
            "SUM(CASE WHEN oi.service_status = 'completed' THEN 1 ELSE 0 END) AS completed_bookings, " +
            "SUM(CASE WHEN oi.service_status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_bookings, " +
            "SUM(oi.unit_price * oi.quantity) AS total_revenue " +
            "FROM order_items oi " +
            "JOIN services s ON oi.service_id = s.id " +
            "JOIN orders o ON oi.order_id = o.id " +
            "WHERE oi.item_type = 'service' " +
            "AND o.created_at >= :fromDate " +
            "GROUP BY s.id, s.name " +
            "ORDER BY total_bookings DESC", nativeQuery = true)
    List<Object[]> findServiceBookingStats(@Param("fromDate") LocalDateTime fromDate);
}