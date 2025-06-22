package com.example.yummypet.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ProductRequest {
    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 200, message = "Tên sản phẩm không được vượt quá 200 ký tự")
    private String name;
    
    private String description;
    
    @NotNull(message = "Giá bán không được để trống")
    @Min(value = 0, message = "Giá bán phải lớn hơn hoặc bằng 0")
    private BigDecimal price;
    
    @Min(value = 0, message = "Giá nhập phải lớn hơn hoặc bằng 0")
    private BigDecimal costPrice;
    
    @NotNull(message = "Danh mục không được để trống")
    private Integer categoryId;
    
    @Min(value = 0, message = "Số lượng tồn kho phải lớn hơn hoặc bằng 0")
    private Integer stockQuantity = 0;
    
    @Min(value = 0, message = "Mức tồn kho tối thiểu phải lớn hơn hoặc bằng 0")
    private Integer minStockLevel = 0;
    
    @Size(max = 100, message = "SKU không được vượt quá 100 ký tự")
    private String sku;
    
    private String barcode;
    
    @Min(value = 0, message = "Khối lượng phải lớn hơn hoặc bằng 0")
    private BigDecimal weight;
    
    private String brand;
    
    private String originCountry;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate expiryDate;
    
    private String imageUrl;
    
    private Boolean isActive = true;
}
