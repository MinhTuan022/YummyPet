package com.example.yummypet.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    public void sendPasswordResetEmail(String to, String subject, String resetUrl) {
        log.info("SENDING PASSWORD RESET EMAIL");
        log.info("To: {}", to);
        log.info("Subject: {}", subject);
        log.info("Reset URL: {}", resetUrl);
    }

    public void sendPasswordChangedEmail(String to) {
        log.info("SENDING PASSWORD CHANGED EMAIL");
        log.info("To: {}", to);
        log.info("Subject: Mật khẩu của bạn đã được thay đổi");
    }
}
