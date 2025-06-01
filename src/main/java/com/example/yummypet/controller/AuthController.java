package com.example.yummypet.controller;

import com.example.yummypet.dto.common.ApiResponse;
import com.example.yummypet.dto.request.LoginRequest;
import com.example.yummypet.dto.request.RegisterRequest;
import com.example.yummypet.dto.response.JwtResponse;
import com.example.yummypet.entity.Employee;
import com.example.yummypet.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse jwtResponse = authService.login(loginRequest);

            return ResponseEntity.ok(new ApiResponse(true, "Login successful", jwtResponse));
        } catch (AuthenticationException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Invalid username or password"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            Employee employee = authService.register(registerRequest);
            System.out.println("employee.getEmployeeCode() = " + employee.getEmployeeCode());

            return ResponseEntity.ok(new ApiResponse(true, "User registered successfully",
                    "Employee code: " + employee.getEmployeeCode()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Registration failed: " + e.getMessage()));
        }
    }
}