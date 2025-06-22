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
import java.util.Optional;
import java.util.UUID;

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
        private final JwtBlacklistRepository jwtBlacklistRepository;
        private final PasswordResetTokenRepository passwordResetTokenRepository;
        private final EmailService emailService;

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
                                                request.getUsername(), request.getPassword()));

                User user = ((UserDetailsImpl) auth.getPrincipal()).getUser();
                String token = jwtService.generateToken(user);

                return new LoginResponse(token, user.getRole().getName());
        }

        public void logout(String token) {
                if (token != null && token.startsWith("Bearer ")) {
                        String jwt = token.substring(7);

                        if (jwtService.validateToken(jwt)) {
                                // Thêm token vào danh sách đen
                                JwtBlacklist blacklistEntry = JwtBlacklist.builder()
                                                .token(jwt)
                                                .expiryDate(jwtService.extractExpirationDate(jwt))
                                                .build();

                                jwtBlacklistRepository.save(blacklistEntry);
                        }
                }
        }

        public void forgotPassword(String email) {
                Optional<User> optionalUser = userRepository.findByEmail(email);

                if (optionalUser.isEmpty()) {
                        return;
                }

                User user = optionalUser.get();

                // Tạo token ngẫu nhiên
                String token = generateResetToken();

                // Lưu token vào database
                LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(30); // Token hết hạn sau 30 phút

                // Kiểm tra xem người dùng đã có token chưa sử dụng không
                passwordResetTokenRepository.findByUserAndUsed(user, false)
                                .ifPresent(passwordResetTokenRepository::delete);

                PasswordResetToken resetToken = PasswordResetToken.builder()
                                .token(token)
                                .user(user)
                                .expiryDate(expiryDate)
                                .used(false)
                                .build();

                passwordResetTokenRepository.save(resetToken);

                // Tạo URL reset password
                String resetUrl = "http://localhost:8080/reset-password?token=" + token;

                // Gửi email
                try {
                        emailService.sendPasswordResetEmail(user.getEmail(), "Đặt lại mật khẩu YummyPet", resetUrl);
                } catch (Exception e) {
                        System.err.println("Có lỗi khi gửi email: " + e.getMessage());
                }
        }

        public void resetPassword(String token, String password, String confirmPassword) {
                if (!password.equals(confirmPassword)) {
                        throw new RuntimeException("Mật khẩu và xác nhận mật khẩu không khớp");
                }

                PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                                .orElseThrow(() -> new RuntimeException("Token không hợp lệ"));

                if (resetToken.isExpired()) {
                        throw new RuntimeException("Token đã hết hạn");
                }

                if (resetToken.isUsed()) {
                        throw new RuntimeException("Token đã được sử dụng");
                }

                User user = resetToken.getUser();
                user.setPasswordHash(passwordEncoder.encode(password));
                user.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
                userRepository.save(user);

                // Đánh dấu token đã sử dụng
                resetToken.setUsed(true);
                passwordResetTokenRepository.save(resetToken);

                // Gửi email thông báo
                try {
                        emailService.sendPasswordChangedEmail(user.getEmail());
                } catch (Exception ignored) {
                        // Bỏ qua lỗi khi gửi email thông báo
                }
        }

        public void changePassword(String username, String oldPassword, String newPassword, String confirmPassword) {
                if (!newPassword.equals(confirmPassword)) {
                        throw new RuntimeException("Mật khẩu mới và xác nhận mật khẩu không khớp");
                }

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

                // Kiểm tra mật khẩu cũ
                if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
                        throw new RuntimeException("Mật khẩu cũ không chính xác");
                }

                // Cập nhật mật khẩu mới
                user.setPasswordHash(passwordEncoder.encode(newPassword));
                user.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
                userRepository.save(user);

                try {
                        emailService.sendPasswordChangedEmail(user.getEmail());
                } catch (Exception ignored) {
                }
        }

        private String generateResetToken() {
                return UUID.randomUUID().toString();
        }
}
