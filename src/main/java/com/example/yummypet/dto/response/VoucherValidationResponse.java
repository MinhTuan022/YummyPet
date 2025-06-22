package com.example.yummypet.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class VoucherValidationResponse {
    private Boolean isValid;
    private String code;
    private String name;
    private BigDecimal discountValue;
    private String discountType;
    private String message;
}
