package com.example.yummypet.repository;

import com.example.yummypet.entity.ReturnExchange;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReturnExchangeRepository extends JpaRepository<ReturnExchange, Integer> {

//    // Find return exchanges by order
//    List<ReturnExchange> findByOrderId(Integer orderId);
//
//    // Find return exchanges by customer
//    @Query("SELECT re FROM ReturnExchange re WHERE re.order.customer.id = :customerId ORDER BY re.createdAt DESC")
//    Page<ReturnExchange> findByCustomerId(@Param("customerId") Integer customerId, Pageable pageable);
//
//    // Find return exchanges by status
//    List<ReturnExchange> findByConditionStatus(String conditionStatus);
//
//    // Find return exchanges in date range
//    @Query("SELECT re FROM ReturnExchange re WHERE re.createdAt BETWEEN :startDate AND :endDate")
//    List<ReturnExchange> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate,
//                                                @Param("endDate") LocalDateTime endDate);
//
//    // Find pending return exchanges
//    @Query("SELECT re FROM ReturnExchange re WHERE re.conditionStatus = 'PENDING' ORDER BY re.createdAt ASC")
//    List<ReturnExchange> findPendingReturnExchanges();
//
//    // Count return exchanges by status
//    @Query("SELECT COUNT(re) FROM ReturnExchange re WHERE re.conditionStatus = :status")
//    Long countByConditionStatus(@Param("status") String status);
//
//    // Find return exchanges by reason
//    List<ReturnExchange> findByReasonContainingIgnoreCase(String reason);
//
//    // Get all return exchanges with pagination, ordered by creation date
//    Page<ReturnExchange> findAllByOrderByCreatedAtDesc(Pageable pageable);
}