package com.example.yummypet.service;

import com.example.yummypet.dto.request.EmployeeRequest;
import com.example.yummypet.dto.request.UpdateEmployeeRequest;
import com.example.yummypet.dto.response.EmployeeDTO;
import com.example.yummypet.entity.Employee;
import com.example.yummypet.entity.Role;
import com.example.yummypet.entity.User;
import com.example.yummypet.repository.EmployeeRepository;
import com.example.yummypet.repository.RoleRepository;
import com.example.yummypet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CodeGeneratorService codeGeneratorService;    @Transactional
    public EmployeeDTO createEmployee(EmployeeRequest request) {
        Role staffRole = roleRepository.findByName("staff")
                .orElseThrow(() -> new IllegalArgumentException("Staff role not found"));

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(staffRole)
                .isActive(true)
                .createdAt(Timestamp.from(Instant.now()))
                .build();
        
        User savedUser = userRepository.save(user);

        Employee employee = Employee.builder()
                .user(savedUser)
                .employeeCode(codeGeneratorService.generateEmployeeCode())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .address(request.getAddress())
                .dateOfBirth(request.getDateOfBirth())
                .hireDate(request.getHireDate())
                .salary(request.getSalary())
                .position(request.getPosition())
                .department(request.getDepartment())
                .isActive(request.getIsActive())
                .createdAt(Timestamp.from(Instant.now()))
                .build();

        Employee savedEmployee = employeeRepository.save(employee);
        log.info("Created employee with code: {}", savedEmployee.getEmployeeCode());
        
        return convertToDTO(savedEmployee);
    }

    @Transactional
    public EmployeeDTO updateEmployee(Integer id, UpdateEmployeeRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with id: " + id));

        if (request.getFullName() != null) {
            employee.setFullName(request.getFullName());
        }
        if (request.getPhone() != null) {
            employee.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            employee.setAddress(request.getAddress());
        }
        if (request.getDateOfBirth() != null) {
            employee.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getSalary() != null) {
            employee.setSalary(request.getSalary());
        }
        if (request.getPosition() != null) {
            employee.setPosition(request.getPosition());
        }
        if (request.getDepartment() != null) {
            employee.setDepartment(request.getDepartment());
        }
        if (request.getIsActive() != null) {
            employee.setIsActive(request.getIsActive());
            employee.getUser().setIsActive(request.getIsActive());
        }
        
        employee.setUpdatedAt(Timestamp.from(Instant.now()));
        Employee savedEmployee = employeeRepository.save(employee);
        
        log.info("Updated employee with code: {}", savedEmployee.getEmployeeCode());
        return convertToDTO(savedEmployee);
    }

    public Page<EmployeeDTO> getAllEmployees(Pageable pageable) {
        return employeeRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    public Optional<EmployeeDTO> getEmployeeById(Integer id) {
        return employeeRepository.findById(id)
                .map(this::convertToDTO);
    }

    public Optional<EmployeeDTO> getEmployeeByCode(String employeeCode) {
        return employeeRepository.findByEmployeeCode(employeeCode)
                .map(this::convertToDTO);
    }

    @Transactional
    public void deleteEmployee(Integer id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with id: " + id));
        
        employee.setIsActive(false);
        employee.getUser().setIsActive(false);
        employee.setUpdatedAt(Timestamp.from(Instant.now()));
        
        employeeRepository.save(employee);
        log.info("Deactivated employee with code: {}", employee.getEmployeeCode());
    }

    private EmployeeDTO convertToDTO(Employee employee) {
        return EmployeeDTO.builder()
                .id(employee.getId())
                .employeeCode(employee.getEmployeeCode())
                .username(employee.getUser().getUsername())
                .email(employee.getEmail())
                .fullName(employee.getFullName())
                .phone(employee.getPhone())
                .address(employee.getAddress())
                .dateOfBirth(employee.getDateOfBirth())
                .hireDate(employee.getHireDate())
                .salary(employee.getSalary())
                .position(employee.getPosition())
                .department(employee.getDepartment())
                .isActive(employee.getIsActive())
                .roleName(employee.getUser().getRole().getName())
                .build();
    }

    @Transactional
    public Employee createEmployee(Employee employee) {
        if (!StringUtils.hasText(employee.getEmployeeCode())) {
            employee.setEmployeeCode(codeGeneratorService.generateEmployeeCode());
        }

        if (!codeGeneratorService.isValidEmployeeCode(employee.getEmployeeCode())) {
            throw new IllegalArgumentException("Invalid employee code format");
        }

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