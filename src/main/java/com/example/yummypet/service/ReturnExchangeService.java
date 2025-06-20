package com.example.yummypet.service;

import com.example.yummypet.entity.ReturnExchange;
import com.example.yummypet.repository.ReturnExchangeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReturnExchangeService {

    private final ReturnExchangeRepository returnExchangeRepository;
    private final CodeGeneratorService codeGeneratorService;

    @Transactional
    public ReturnExchange createReturnExchange(ReturnExchange returnExchange) {
        // Tạo mã đổi trả nếu chưa có
        if (!StringUtils.hasText(returnExchange.getReturnCode())) {
            returnExchange.setReturnCode(codeGeneratorService.generateReturnCode());
        }

        // Validate mã đổi trả
        if (!codeGeneratorService.isValidReturnCode(returnExchange.getReturnCode())) {
            throw new IllegalArgumentException("Invalid return code format");
        }

        // Kiểm tra trùng lặp
        if (returnExchangeRepository.existsByReturnCode(returnExchange.getReturnCode())) {
            throw new IllegalArgumentException("Return code already exists: " + returnExchange.getReturnCode());
        }

        log.info("Creating return/exchange with code: {}", returnExchange.getReturnCode());
        return returnExchangeRepository.save(returnExchange);
    }
}