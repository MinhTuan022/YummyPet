package com.example.yummypet.dto.response;

import com.example.yummypet.enums.Gender;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class CustomerResponse {
    private Integer id;
    private String customerCode;
    private String fullName;
    private String phone;
    private String email;
    private String address;
    private LocalDate dateOfBirth;
    private Gender gender;
    private Integer loyaltyPoints;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean hasAccount;
}
