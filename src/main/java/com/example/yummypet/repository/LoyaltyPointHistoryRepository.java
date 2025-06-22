package com.example.yummypet.repository;

import com.example.yummypet.entity.LoyaltyPointHistory;
import com.example.yummypet.enums.LoyaltyPointType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface LoyaltyPointHistoryRepository extends JpaRepository<LoyaltyPointHistory, Long> {
    
    Page<LoyaltyPointHistory> findByCustomerIdOrderByCreatedAtDesc(Integer customerId, Pageable pageable);
    
    Page<LoyaltyPointHistory> findByCustomerIdAndTypeOrderByCreatedAtDesc(Integer customerId, LoyaltyPointType type, Pageable pageable);
    
    @Query("SELECT l FROM LoyaltyPointHistory l WHERE l.customer.id = :customerId " +
           "AND l.createdAt BETWEEN :startDate AND :endDate ORDER BY l.createdAt DESC")
    Page<LoyaltyPointHistory> findByCustomerIdAndDateRange(
            @Param("customerId") Integer customerId,
            @Param("startDate") Timestamp startDate,
            @Param("endDate") Timestamp endDate,
            Pageable pageable);
    
    @Query("SELECT COALESCE(SUM(l.points), 0) FROM LoyaltyPointHistory l WHERE l.customer.id = :customerId AND l.type = :type")
    Integer sumPointsByCustomerIdAndType(@Param("customerId") Integer customerId, @Param("type") LoyaltyPointType type);
    
    List<LoyaltyPointHistory> findTop10ByCustomerIdOrderByCreatedAtDesc(Integer customerId);
    @Query("SELECT COALESCE(SUM(l.points), 0) FROM LoyaltyPointHistory l WHERE l.type = :type")
    Long sumPointsByType(@Param("type") LoyaltyPointType type);
    
    @Query("SELECT COALESCE(SUM(l.points), 0) FROM LoyaltyPointHistory l WHERE l.type = :type")
    Long sumPointsByTypeString(@Param("type") String type);
    
    // Thêm các phương thức cho thống kê
    // @Query("SELECT COALESCE(SUM(l.points), 0) FROM LoyaltyPointHistory l WHERE l.type = com.example.yummypet.enums.LoyaltyPointType.EARN")
    // Long getTotalPointsIssued();
    
    // @Query("SELECT COALESCE(SUM(l.points), 0) FROM LoyaltyPointHistory l WHERE l.type = com.example.yummypet.enums.LoyaltyPointType.REDEEM")
    // Long getTotalPointsRedeemed();
}
