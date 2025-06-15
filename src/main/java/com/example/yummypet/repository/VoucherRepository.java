package com.example.yummypet.repository;

import com.example.yummypet.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Integer> {

    @Query("SELECT v FROM Voucher v WHERE v.isActive = true AND v.endDate > :currentDate")
    List<Voucher> findActiveVouchers(@Param("currentDate") LocalDateTime currentDate);

    Optional<Voucher> findByCodeAndIsActiveTrue(String code);

    @Query("SELECT v FROM Voucher v WHERE v.isActive = true AND v.endDate > :currentDate AND v.usageLimit > v.usedCount")
    List<Voucher> findAvailableVouchers(@Param("currentDate") LocalDateTime currentDate);

    @Query("SELECT v FROM Voucher v WHERE v.endDate < :currentDate OR v.isActive = false")
    List<Voucher> findExpiredVouchers(@Param("currentDate") LocalDateTime currentDate);

    @Query("SELECT v FROM Voucher v WHERE v.id = :voucherId AND v.isActive = true AND " +
            "v.endDate > :currentDate AND (v.usageLimit IS NULL OR v.usageLimit > v.usedCount)")
    Optional<Voucher> findValidVoucherById(@Param("voucherId") Integer voucherId,
                                           @Param("currentDate") LocalDateTime currentDate);
}
