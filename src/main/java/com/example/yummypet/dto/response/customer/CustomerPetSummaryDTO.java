package com.example.yummypet.dto.response.customer;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CustomerPetSummaryDTO {
    private Integer id;
    private String breed;
    private String gender;
    private Integer age;
    private BigDecimal weight;
    private String specialNotes;
}