package com.example.yummypet.dto.response.customer;

import com.example.yummypet.entity.Gender;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CustomerDTO {
    private Integer id;
    private String customerCode;
    private String fullName;
    private String username;
    private String phone;
    private String email;
    private String address;
    private Gender gender;
    private LocalDate dateOfBirth;
    private Integer loyaltyPoints;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Thông tin thống kê
    private Integer totalPets;
    private Integer totalOrders;
    private Integer totalServiceOrders;
    private Integer cartItemsCount;
}