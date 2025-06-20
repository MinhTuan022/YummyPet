package com.example.yummypet.service;

import com.example.yummypet.entity.Customer;
import com.example.yummypet.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CodeGeneratorService codeGeneratorService;

    @Transactional
    public Customer createCustomer(Customer customer) {
        // Tạo mã khách hàng nếu chưa có
        if (!StringUtils.hasText(customer.getCustomerCode())) {
            customer.setCustomerCode(codeGeneratorService.generateCustomerCode());
        }

        // Validate mã khách hàng
        if (!codeGeneratorService.isValidCustomerCode(customer.getCustomerCode())) {
            throw new IllegalArgumentException("Invalid customer code format");
        }

        // Kiểm tra trùng lặp
        if (customerRepository.existsByCustomerCode(customer.getCustomerCode())) {
            throw new IllegalArgumentException("Customer code already exists: " + customer.getCustomerCode());
        }

        log.info("Creating customer with code: {}", customer.getCustomerCode());
        return customerRepository.save(customer);
    }

    @Transactional
    public Customer updateCustomer(Customer customer) {
        if (!customerRepository.existsById(customer.getId())) {
            throw new IllegalArgumentException("Customer not found with id: " + customer.getId());
        }

        log.info("Updating customer with code: {}", customer.getCustomerCode());
        return customerRepository.save(customer);
    }
}
