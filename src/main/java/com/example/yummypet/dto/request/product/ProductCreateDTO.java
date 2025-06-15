package com.example.yummypet.dto.request.product;

import com.example.yummypet.entity.Product;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductCreateDTO {
    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 100, message = "Tên sản phẩm không được quá 100 ký tự")
    private String name;

    @Size(max = 500, message = "Mô tả không được quá 500 ký tự")
    private String description;

    @NotNull(message = "Giá không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá phải lớn hơn 0")
    @Digits(integer = 8, fraction = 2, message = "Giá không hợp lệ")
    private BigDecimal price;

    @NotNull(message = "Số lượng tồn kho không được để trống")
    @Min(value = 0, message = "Số lượng tồn kho không được âm")
    private Integer stockQuantity;


    @Min(value = 0, message = "Tuổi không được âm")
    private Integer ageMonths;


    @Size(max = 50, message = "Giống không được quá 50 ký tự")
    private String breed;

    @Size(max = 50, message = "Màu sắc không được quá 50 ký tự")
    private String color;


    private Product.Gender gender;

    @Size(max = 100, message = "Tình trạng sức khỏe không được quá 100 ký tự")
    private String healthStatus;

    @Size(max = 50, message = "Tình trạng tiêm chủng không được quá 50 ký tự")
    private String vaccinationStatus;

    @Size(max = 100, message = "Thông tin chứng nhận không được quá 100 ký tự")
    private String certificateInfo;

    @DecimalMin(value = "0.0", message = "Cân nặng không được âm")
    @Digits(integer = 3, fraction = 2, message = "Cân nặng không hợp lệ")
    private BigDecimal weight;

    @Size(max = 200, message = "URL hình ảnh không được quá 200 ký tự")
    private String imageUrl;

    @NotNull(message = "Danh mục không được để trống")
    private Integer categoryId;


    private Boolean isActive = true;

    private Boolean isPet = true;

    @Size(max = 200, message = "URL hình ảnh không được quá 200 ký tự")
    private String barcode;

    @Enumerated(EnumType.STRING)

    private Product.BarcodeType barcodeType;

    @Size(max = 200, message = "URL hình ảnh không được quá 200 ký tự")
    private String sku;

    // Constructors, getters, setters
}
