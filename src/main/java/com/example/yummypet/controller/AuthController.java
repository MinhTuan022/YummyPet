package com.example.yummypet.controller;

import com.example.yummypet.config.JwtService;
import com.example.yummypet.dto.ApiResponse;
import com.example.yummypet.dto.auth.*;
import com.example.yummypet.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

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

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestBody LogoutRequest request) {
        authService.logout(request.getToken());
        return ResponseEntity.ok(ApiResponse.success("Đăng xuất thành công"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.getEmail());
        return ResponseEntity.ok(ApiResponse.success("Link đặt lại mật khẩu đã được gửi đến email của bạn"));
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getPassword(), request.getConfirmPassword());
        return ResponseEntity.ok(ApiResponse.success("Đặt lại mật khẩu thành công"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody ChangePasswordRequest request) {
        
        // Lấy username từ token JWT
        String bearerToken = token.substring(7);
        String username = jwtService.extractUsername(bearerToken);
        
        authService.changePassword(username, request.getOldPassword(), request.getNewPassword(), request.getConfirmPassword());
        
        return ResponseEntity.ok(ApiResponse.success("Đổi mật khẩu thành công"));
    }
}
