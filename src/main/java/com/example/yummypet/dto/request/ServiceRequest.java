package com.example.yummypet.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ServiceRequest {
    @NotBlank(message = "Tên dịch vụ không được để trống")
    @Size(max = 200, message = "Tên dịch vụ không được vượt quá 200 ký tự")
    private String name;
    
    private String description;
    
    @NotNull(message = "Giá dịch vụ không được để trống")
    @Min(value = 0, message = "Giá dịch vụ phải lớn hơn hoặc bằng 0")
    private BigDecimal price;
    
    @Min(value = 1, message = "Thời gian thực hiện phải ít nhất 1 phút")
    private Integer durationMinutes = 30; // Mặc định 30 phút
    
    private Boolean isActive = true;
}
