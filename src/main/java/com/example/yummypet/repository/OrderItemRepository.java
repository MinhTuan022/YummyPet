package com.example.yummypet.repository;

import com.example.yummypet.entity.OrderItem;
import com.example.yummypet.enums.ItemType;
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

}