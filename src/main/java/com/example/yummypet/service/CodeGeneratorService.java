package com.example.yummypet.service;

import com.example.yummypet.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import com.example.yummypet.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class CodeGeneratorService {

    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final ReturnExchangeRepository returnExchangeRepository;
    private final PetRepository petRepository;
    private final EmployeeRepository employeeRepository;

    /**
     * Tạo mã khách hàng duy nhất
     * Format: CUS + 6 số (ví dụ: CUS000001)
     */
    @Transactional(readOnly = true)
    public String generateCustomerCode() {
        long maxId = customerRepository.findMaxId().orElse(0);
        String code;
        int attempts = 0;
        final int MAX_ATTEMPTS = 10;

        do {
            code = String.format("CUS%06d", maxId + 1 + attempts);
            attempts++;
        } while (customerRepository.existsByCustomerCode(code) && attempts < MAX_ATTEMPTS);

        if (attempts >= MAX_ATTEMPTS) {
            throw new RuntimeException("Cannot generate unique customer code after " + MAX_ATTEMPTS + " attempts");
        }

        log.debug("Generated customer code: {}", code);
        return code;
    }

    /**
     * Tạo mã đơn hàng duy nhất
     * Format: ORD + YYYYMMDD + 4 số (ví dụ: ORD202506190001)
     */
    @Transactional(readOnly = true)
    public String generateOrderCode() {
        long countToday = orderRepository.countTodayOrders();
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String code;
        int attempts = 0;
        final int MAX_ATTEMPTS = 10;

        do {
            code = String.format("ORD%s%04d", date, countToday + 1 + attempts);
            attempts++;
        } while (orderRepository.existsByOrderCode(code) && attempts < MAX_ATTEMPTS);

        if (attempts >= MAX_ATTEMPTS) {
            throw new RuntimeException("Cannot generate unique order code after " + MAX_ATTEMPTS + " attempts");
        }

        log.debug("Generated order code: {}", code);
        return code;
    }

    /**
     * Tạo mã đổi trả duy nhất
     * Format: RET + YYYYMMDD + 4 số (ví dụ: RET202506190001)
     */
    @Transactional(readOnly = true)
    public String generateReturnCode() {
        long countToday = returnExchangeRepository.countTodayReturns();
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String code;
        int attempts = 0;
        final int MAX_ATTEMPTS = 10;

        do {
            code = String.format("RET%s%04d", date, countToday + 1 + attempts);
            attempts++;
        } while (returnExchangeRepository.existsByReturnCode(code) && attempts < MAX_ATTEMPTS);

        if (attempts >= MAX_ATTEMPTS) {
            throw new RuntimeException("Cannot generate unique return code after " + MAX_ATTEMPTS + " attempts");
        }

        log.debug("Generated return code: {}", code);
        return code;
    }

    /**
     * Tạo mã thú cưng duy nhất
     * Format: PET + 6 số (ví dụ: PET000001)
     */
    @Transactional(readOnly = true)
    public String generatePetCode() {
        long maxId = petRepository.findMaxId().orElse(0);
        String code;
        int attempts = 0;
        final int MAX_ATTEMPTS = 10;

        do {
            code = String.format("PET%06d", maxId + 1 + attempts);
            attempts++;
        } while (petRepository.existsByPetCode(code) && attempts < MAX_ATTEMPTS);

        if (attempts >= MAX_ATTEMPTS) {
            throw new RuntimeException("Cannot generate unique pet code after " + MAX_ATTEMPTS + " attempts");
        }

        log.debug("Generated pet code: {}", code);
        return code;
    }

    /**
     * Tạo mã nhân viên duy nhất
     * Format: EMP + 6 số (ví dụ: EMP000001)
     */
    @Transactional(readOnly = true)
    public String generateEmployeeCode() {
        long maxId = employeeRepository.findMaxId().orElse(0);
        String code;
        int attempts = 0;
        final int MAX_ATTEMPTS = 10;

        do {
            code = String.format("EMP%06d", maxId + 1 + attempts);
            attempts++;
        } while (employeeRepository.existsByEmployeeCode(code) && attempts < MAX_ATTEMPTS);

        if (attempts >= MAX_ATTEMPTS) {
            throw new RuntimeException("Cannot generate unique employee code after " + MAX_ATTEMPTS + " attempts");
        }

        log.debug("Generated employee code: {}", code);
        return code;
    }

    /**
     * Validate format của customer code
     */
    public boolean isValidCustomerCode(String code) {
        return code != null && code.matches("^CUS\\d{6}$");
    }

    /**
     * Validate format của order code
     */
    public boolean isValidOrderCode(String code) {
        return code != null && code.matches("^ORD\\d{8}\\d{4}$");
    }

    /**
     * Validate format của return code
     */
    public boolean isValidReturnCode(String code) {
        return code != null && code.matches("^RET\\d{8}\\d{4}$");
    }

    /**
     * Validate format của pet code
     */
    public boolean isValidPetCode(String code) {
        return code != null && code.matches("^PET\\d{6}$");
    }

    /**
     * Validate format của employee code
     */
    public boolean isValidEmployeeCode(String code) {
        return code != null && code.matches("^EMP\\d{6}$");
    }
}