package com.example.yummypet.service;

import com.example.yummypet.config.JwtService;
import com.example.yummypet.config.UserDetailsImpl;
import com.example.yummypet.dto.auth.CreateUserRequest;
import com.example.yummypet.dto.auth.LoginRequest;
import com.example.yummypet.dto.auth.LoginResponse;
import com.example.yummypet.dto.auth.RegisterRequest;
import com.example.yummypet.entity.*;
import com.example.yummypet.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CodeGeneratorService codeGeneratorService;


    public void registerCustomer(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername()))
            throw new RuntimeException("Tài khoản đã tồn tại");

        Role role = roleRepository.findByName("customer")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy role"));

        User user = User.builder()
                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .isActive(true)
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .role(role)
                .build();
        userRepository.save(user);

        Customer customer = Customer.builder()
                .customerCode(codeGeneratorService.generateCustomerCode())
                .user(user)
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .createdAt(Timestamp.valueOf(LocalDateTime.now()))
                .isActive(true)
                .build();
        customerRepository.save(customer);
    }

    public void createEmployee(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername()))
            throw new RuntimeException("Tài khoản đã tồn tại");

        Role role = roleRepository.findByName(request.getRole().toUpperCase())
                .orElseThrow(() -> new RuntimeException("Role không tồn tại"));

        User user = User.builder()

                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .isActive(true)
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .role(role)
                .build();
        userRepository.save(user);

        Employee employee = Employee.builder()
                .employeeCode(codeGeneratorService.generateEmployeeCode())
                .hireDate(request.getHireDate())
                .user(user)
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .position(request.getPosition())
                .salary(request.getSalary())
                .department(request.getDepartment())
                .dateOfBirth(request.getDateOfBirth())
                .createdAt(Timestamp.valueOf(LocalDateTime.now()))
                .isActive(true)
                .build();
        employeeRepository.save(employee);
    }

    public LoginResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(), request.getPassword()
                )
        );

        User user = ((UserDetailsImpl) auth.getPrincipal()).getUser();
        String token = jwtService.generateToken(user);

        return new LoginResponse(token, user.getRole().getName());
    }
}
