package com.example.yummypet.repository;

import com.example.yummypet.entity.JwtBlacklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public interface JwtBlacklistRepository extends JpaRepository<JwtBlacklist, Long> {

    boolean existsByToken(String token);
    

    void deleteByExpiryDateBefore(Date expiryDate);
}
