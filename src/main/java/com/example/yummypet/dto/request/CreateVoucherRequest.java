package com.example.yummypet.dto.request;

import com.example.yummypet.enums.DiscountType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CreateVoucherRequest {
    @NotBlank(message = "Mã voucher không được để trống")
    @Size(max = 50, message = "Mã voucher không được vượt quá 50 ký tự")
    private String code;

    @NotBlank(message = "Tên voucher không được để trống")
    @Size(max = 200, message = "Tên voucher không được vượt quá 200 ký tự")
    private String name;

    @NotNull(message = "Loại giảm giá không được để trống")
    private DiscountType discountType;

    @NotNull(message = "Giá trị giảm giá không được để trống")
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

    @NotNull(message = "Trạng thái kích hoạt không được để trống")
    private Boolean isActive;
}
