package com.example.yummypet.dto.auth;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateUserRequest {
    private String username;
    private String password;
    private String email;
    private String fullName;
    private String phone;
    private String role;
    private String position;
    private BigDecimal salary;
    private LocalDate dateOfBirth;
    private LocalDate hireDate;
    private String department;
}

