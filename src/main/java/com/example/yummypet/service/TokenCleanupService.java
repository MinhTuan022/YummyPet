package com.example.yummypet.service;

import com.example.yummypet.repository.JwtBlacklistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * Service dùng để dọn dẹp token trong blacklist đã hết hạn
 */
@Service
@RequiredArgsConstructor
public class TokenCleanupService {

    private final JwtBlacklistRepository jwtBlacklistRepository;
    
    /**
     * Tự động xóa các token đã hết hạn khỏi blacklist mỗi ngày
     */
    @Scheduled(cron = "0 0 0 * * ?") // Chạy lúc 00:00 mỗi ngày
    public void cleanupExpiredTokens() {
        jwtBlacklistRepository.deleteByExpiryDateBefore(new Date());
    }
}
