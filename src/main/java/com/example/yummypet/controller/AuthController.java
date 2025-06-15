package com.example.yummypet.controller;

import com.example.yummypet.dto.common.ApiResponse;
import com.example.yummypet.dto.request.ChangePasswordRequest;
import com.example.yummypet.dto.request.LoginRequest;
import com.example.yummypet.dto.request.RegisterRequest;
import com.example.yummypet.dto.request.customer.CustomerRegisterDTO;
import com.example.yummypet.dto.response.JwtResponse;
import com.example.yummypet.dto.response.customer.CustomerResponseDTO;
import com.example.yummypet.entity.Customer;
import com.example.yummypet.entity.Employee;
import com.example.yummypet.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;

@PostMapping("/login/admin")
public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
    try {
        JwtResponse jwtResponse = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("Login successful", jwtResponse));
    } catch (AuthenticationException e) {
        return ResponseEntity.badRequest()
                .body(ApiResponse.error("Invalid username or password"));
    } catch (Exception e) {
        return ResponseEntity.badRequest()
                .body(ApiResponse.error("Login failed: " + e.getMessage()));
    }
}

    @PostMapping("/register/admin")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            Employee employee = authService.register(registerRequest);
            return ResponseEntity.ok(ApiResponse.success(
                    "User registered successfully",
                    "Employee code: " + employee.getEmployeeCode()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginCustomer(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            CustomerResponseDTO jwtResponse = authService.customerLogin(loginRequest);
            return ResponseEntity.ok(ApiResponse.success("Login successful", jwtResponse));
        } catch (AuthenticationException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid username or password"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@Valid @RequestBody CustomerRegisterDTO registerRequest) {
        try {
            Customer customer = authService.customerRegister(registerRequest);
            return ResponseEntity.ok(ApiResponse.success(
                    "User registered successfully",
                    "Employee code: " + customer.getCustomerCode()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Registration failed: " + e.getMessage()));
        }
    }

    @PutMapping("/change-password/admin")
    public ResponseEntity<?> changeEmployeePassword(@Valid @RequestBody ChangePasswordRequest changePasswordRequest) {
        try {
            // Get current authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();

            authService.changeEmployeePassword(username, changePasswordRequest);
            return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Password change failed: " + e.getMessage()));
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changeCustomerPassword(@Valid @RequestBody ChangePasswordRequest changePasswordRequest) {
        try {
            // Get current authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();

            authService.changeCustomerPassword(username, changePasswordRequest);
            return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Password change failed: " + e.getMessage()));
        }
    }


}