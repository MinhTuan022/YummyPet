package com.example.yummypet.dto.response.employee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponseDTO {
    private Integer id;
    private LocalDateTime createdAt;
    private String email;
    private String employeeCode;
    private String fullName;
    private Boolean isActive;
    private String phone;
    private LocalDateTime updatedAt;
    private String username;
    private String password;

    private String role;
    private String address;
    private String gender;
    private LocalDate dateOfBirth;



    // Không bao gồm password trong DTO để bảo mật
}
