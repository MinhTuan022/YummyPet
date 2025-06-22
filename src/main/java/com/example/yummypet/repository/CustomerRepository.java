package com.example.yummypet.repository;

import com.example.yummypet.entity.Customer;
import com.example.yummypet.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    @Query("SELECT MAX(c.id) FROM Customer c")
    Optional<Integer> findMaxId();

    Optional<Customer> findByCustomerCode(String customerCode);

    boolean existsByCustomerCode(String customerCode);
    
    Optional<Customer> findByUser(User user);
    
    Optional<Customer> findByEmail(String email);
    
    Optional<Customer> findByPhone(String phone);
    
    @Query("SELECT c FROM Customer c WHERE LOWER(c.phone) LIKE LOWER(CONCAT('%', :phonePartial, '%'))")
    Page<Customer> findByPhoneContaining(@Param("phonePartial") String phonePartial, Pageable pageable);
    
    @Query("SELECT c FROM Customer c WHERE c.isActive = true")
    Page<Customer> findAllActive(Pageable pageable);
    
    @Query("SELECT c FROM Customer c WHERE " +
           "(:keyword IS NULL OR LOWER(c.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.phone) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.customerCode) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Customer> searchCustomers(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT c FROM Customer c WHERE c.loyaltyPoints >= :minPoints ORDER BY c.loyaltyPoints DESC")
    List<Customer> findTopCustomersByLoyaltyPoints(@Param("minPoints") Integer minPoints, Pageable pageable);
    
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.createdAt BETWEEN :startDate AND :endDate")
    Long countByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(DISTINCT o.customer.id) FROM Order o WHERE o.createdAt >= :since")
    Long countActiveCustomersSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(c) FROM Customer c WHERE (SELECT COUNT(o) FROM Order o WHERE o.customer.id = c.id) >= 3")
    Long countLoyalCustomers();
    
    @Query("SELECT COALESCE(AVG(c.loyaltyPoints), 0) FROM Customer c")
    Integer getAverageLoyaltyPoints();
    
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.createdAt BETWEEN :startDate AND :endDate")
    Long countNewCustomersBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
