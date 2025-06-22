package com.example.yummypet.repository;

import com.example.yummypet.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Integer> {
    Optional<Voucher> findByCode(String code);
    
    boolean existsByCode(String code);
    
    List<Voucher> findByIsActiveTrue();
    
    @Query("SELECT v FROM Voucher v WHERE v.isActive = true AND " +
           "(v.startDate IS NULL OR v.startDate <= :now) AND " +
           "(v.endDate IS NULL OR v.endDate >= :now) AND " +
           "(v.usageLimit IS NULL OR v.usedCount < v.usageLimit)")
    List<Voucher> findAllValidVouchers(LocalDateTime now);
}
