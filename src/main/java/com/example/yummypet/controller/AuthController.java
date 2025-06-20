package com.example.yummypet.controller;

import com.example.yummypet.dto.ApiResponse;
import com.example.yummypet.dto.auth.*;
import com.example.yummypet.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@RequestBody RegisterRequest request) {
        authService.registerCustomer(request);
        return ResponseEntity.ok(ApiResponse.success("Đăng ký thành công"));
    }

    @PostMapping("/create-user")
    public ResponseEntity<ApiResponse<Void>> createUser(@RequestBody CreateUserRequest request) {
        authService.createEmployee(request);
        return ResponseEntity.ok(ApiResponse.success("Tạo tài khoản thành công"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request) {
        LoginResponse loginResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", loginResponse));
    }
}
