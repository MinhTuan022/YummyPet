package com.example.yummypet.service;

import com.example.yummypet.entity.Employee;
import com.example.yummypet.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final CodeGeneratorService codeGeneratorService;

    @Transactional
    public Employee createEmployee(Employee employee) {
        // Tạo mã nhân viên nếu chưa có
        if (!StringUtils.hasText(employee.getEmployeeCode())) {
            employee.setEmployeeCode(codeGeneratorService.generateEmployeeCode());
        }

        // Validate mã nhân viên
        if (!codeGeneratorService.isValidEmployeeCode(employee.getEmployeeCode())) {
            throw new IllegalArgumentException("Invalid employee code format");
        }

        // Kiểm tra trùng lặp
        if (employeeRepository.existsByEmployeeCode(employee.getEmployeeCode())) {
            throw new IllegalArgumentException("Employee code already exists: " + employee.getEmployeeCode());
        }

        log.info("Creating employee with code: {}", employee.getEmployeeCode());
        return employeeRepository.save(employee);
    }

    @Transactional
    public Employee updateEmployee(Employee employee) {
        if (!employeeRepository.existsById(employee.getId())) {
            throw new IllegalArgumentException("Employee not found with id: " + employee.getId());
        }

        log.info("Updating employee with code: {}", employee.getEmployeeCode());
        return employeeRepository.save(employee);
    }
}