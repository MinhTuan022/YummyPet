package com.example.yummypet.repository;

import com.example.yummypet.entity.LoyaltyPointHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoyaltyPointHistoryRepository extends JpaRepository<LoyaltyPointHistory, Long> {
}
