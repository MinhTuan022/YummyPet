package com.example.yummypet.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateEmployeeRequest {
    private String fullName;
    private String phone;
    private String address;
    private LocalDate dateOfBirth;
    private BigDecimal salary;
    private String position;
    private String department;
    private Boolean isActive;
}
