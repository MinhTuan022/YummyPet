package com.example.yummypet.dto.request;

import com.example.yummypet.enums.Gender;
import com.example.yummypet.enums.HealthStatus;
import com.example.yummypet.enums.PetStatus;
import com.example.yummypet.enums.VaccinationStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
public class PetRequest {
    @NotBlank(message = "Tên thú cưng không được để trống")
    @Size(max = 100, message = "Tên thú cưng không được vượt quá 100 ký tự")
    private String name;
    
    @NotNull(message = "Danh mục thú cưng không được để trống")
    private Integer categoryId;
    
    @NotBlank(message = "Loài không được để trống")
    @Size(max = 50, message = "Loài không được vượt quá 50 ký tự")
    private String species;
    
    @Size(max = 50, message = "Giống không được vượt quá 50 ký tự")
    private String breed;
    
    private Gender gender;
    
    @Min(value = 0, message = "Số tháng tuổi phải lớn hơn hoặc bằng 0")
    private Integer ageMonths;
    
    @DecimalMin(value = "0.0", message = "Cân nặng phải lớn hơn hoặc bằng 0")
    private BigDecimal weight;
    
    private String color;
    
    @NotNull(message = "Giá không được để trống")
    @DecimalMin(value = "0.0", message = "Giá phải lớn hơn hoặc bằng 0")
    private BigDecimal price;
    
    @DecimalMin(value = "0.0", message = "Giá nhập phải lớn hơn hoặc bằng 0")
    private BigDecimal costPrice;
    
    private String description;
    
    private LocalDate arrivalDate = LocalDate.now();
    
    private PetStatus status = PetStatus.available;
    
    private String certificateInfo;
    
    private HealthStatus healthStatus = HealthStatus.unknown;
    
    private VaccinationStatus vaccinationStatus = VaccinationStatus.unknown;
    
    private Boolean isActive = true;
    
    @Valid
    private List<PetImageRequest> images = new ArrayList<>();
}
