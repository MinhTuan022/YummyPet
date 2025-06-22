package com.example.yummypet.dto.request;

import com.example.yummypet.enums.DiscountType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class UpdateVoucherRequest {
    @Size(max = 200, message = "Tên voucher không được vượt quá 200 ký tự")
    private String name;
    
    private DiscountType discountType;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá trị giảm giá phải lớn hơn 0")
    private BigDecimal discountValue;
    
    @DecimalMin(value = "0.0", inclusive = true, message = "Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 0")
    private BigDecimal minOrderAmount;
    
    @DecimalMin(value = "0.0", inclusive = true, message = "Giá trị giảm giá tối đa phải lớn hơn hoặc bằng 0")
    private BigDecimal maxDiscountAmount;
    
    @Min(value = 1, message = "Số lượng sử dụng tối đa phải lớn hơn 0")
    private Integer usageLimit;
    
    private LocalDateTime startDate;
    
    private LocalDateTime endDate;
    
    private Boolean isActive;
}
