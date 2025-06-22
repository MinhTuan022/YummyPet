package com.example.yummypet.repository;

import com.example.yummypet.entity.ReturnExchange;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReturnExchangeRepository extends JpaRepository<ReturnExchange, Integer> {

    @Query("SELECT COUNT(r) FROM ReturnExchange r WHERE DATE(r.createdAt) = CURRENT_DATE")
    int countTodayReturns();

    Optional<ReturnExchange> findByReturnCode(String returnCode);

    boolean existsByReturnCode(String returnCode);
    
    Page<ReturnExchange> findByCustomerId(Integer customerId, Pageable pageable);
}