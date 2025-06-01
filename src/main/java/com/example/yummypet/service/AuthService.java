package com.example.yummypet.service;

import com.example.yummypet.config.JwtUtil;
import com.example.yummypet.dto.request.LoginRequest;
import com.example.yummypet.dto.request.RegisterRequest;
import com.example.yummypet.dto.response.JwtResponse;
import com.example.yummypet.entity.Employee;
import com.example.yummypet.entity.Role;
import com.example.yummypet.repository.EmployeeRepository;
import com.example.yummypet.repository.RoleRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PersistenceContext
    private EntityManager entityManager;

    public JwtResponse login(LoginRequest loginRequest) throws AuthenticationException {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        Employee employee = employeeRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(employee.getUsername(), employee.getRole().getName());

        return new JwtResponse(token, employee.getUsername(), employee.getFullName(), employee.getRole().getName());
    }
    @Transactional
    public Employee register(RegisterRequest registerRequest) {
        if (employeeRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        if (registerRequest.getEmail() != null && employeeRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        Role role = roleRepository.findByName(registerRequest.getRoleName())
                .orElseThrow(() -> new RuntimeException("Role not found: " + registerRequest.getRoleName()));

        Employee employee = new Employee();
        employee.setUsername(registerRequest.getUsername());
        employee.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        employee.setFullName(registerRequest.getFullName());
        employee.setPhone(registerRequest.getPhone());
        employee.setEmail(registerRequest.getEmail());
        employee.setRole(role);
        employee.setIsActive(true);

        Employee saved = employeeRepository.save(employee);

        entityManager.refresh(saved);

        return saved;
    }
}
