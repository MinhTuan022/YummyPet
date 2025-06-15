package com.example.yummypet.dto.response.customer;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CustomerResponseDTO {
    private String token;
    private String username;
    private String fullName;
    private String email;
    private String customerCode;
    private Integer loyaltyPoints;
    private String userType = "CUSTOMER";
}