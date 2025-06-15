package com.example.yummypet.repository;

import com.example.yummypet.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Optional<Customer> findByUsername(String username);
    Optional<Customer> findByEmail(String email);
    Optional<Customer> findByPhone(String phone);
    Optional<Customer> findByCustomerCode(String customerCode);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    boolean existsByCustomerCode(String customerCode);

    List<Customer> findByIsActiveTrue();

    Page<Customer> findByIsActiveTrue(Pageable pageable);

    Optional<Customer> findByCustomerCodeAndIsActiveTrue(String customerCode);

    Optional<Customer> findByPhoneAndIsActiveTrue(String phone);

    Optional<Customer> findByEmailAndIsActiveTrue(String email);

    @Query("SELECT DISTINCT c FROM Customer c " +
            "LEFT JOIN FETCH c.pets " +
            "WHERE c.isActive = true")
    List<Customer> findAllActiveWithPets();

    @Query("SELECT c FROM Customer c " +
            "LEFT JOIN FETCH c.pets " +
            "WHERE c.id = :id AND c.isActive = true")
    Optional<Customer> findByIdWithPets(@Param("id") Integer id);

    @Query("SELECT DISTINCT c FROM Customer c " +
            "LEFT JOIN FETCH c.orders o " +
            "WHERE c.id = :id AND c.isActive = true " +
            "ORDER BY o.createdAt DESC")
    Optional<Customer> findByIdWithOrders(@Param("id") Integer id);

    @Query("SELECT DISTINCT c FROM Customer c " +
            "LEFT JOIN FETCH c.serviceOrders so " +
            "WHERE c.id = :id AND c.isActive = true " +
            "ORDER BY so.createdAt DESC")
    Optional<Customer> findByIdWithServiceOrders(@Param("id") Integer id);

    @Query("SELECT DISTINCT c FROM Customer c " +
            "LEFT JOIN FETCH c.loyaltyPointHistory lph " +
            "WHERE c.id = :id AND c.isActive = true " +
            "ORDER BY lph.createdAt DESC")
    Optional<Customer> findByIdWithLoyaltyHistory(@Param("id") Integer id);
}