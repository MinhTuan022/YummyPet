package com.example.yummypet.dto.response.product;

import com.example.yummypet.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor

public class ProductResponseDTO {
    private Integer id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private Integer ageMonths;
    private String breed;
    private String color;
    private Product.Gender gender;
    private String healthStatus;
    private String vaccinationStatus;
    private String certificateInfo;
    private String barcode;
    private String barcodeType;
    private String sku;


    private BigDecimal weight;
    private String imageUrl;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Category info
    private Integer categoryId;
    private String categoryName;

    // Constructors, getters, setters
    public ProductResponseDTO(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.stockQuantity = product.getStockQuantity();
        this.ageMonths = product.getAgeMonths();
        this.breed = product.getBreed();
        this.color = product.getColor();
        this.gender = product.getGender();
        this.healthStatus = product.getHealthStatus();
        this.vaccinationStatus = product.getVaccinationStatus();
        this.certificateInfo = product.getCertificateInfo();
        this.weight = product.getWeight();
        this.imageUrl = product.getImageUrl();
        this.isActive = product.getIsActive();
        this.createdAt = product.getCreatedAt();
        this.updatedAt = product.getUpdatedAt();
        this.barcodeType = product.getBarcode();
        this.barcode = product.getBarcode();
        this.sku = product.getSku();

        if (product.getCategory() != null) {
            this.categoryId = product.getCategory().getId();
            this.categoryName = product.getCategory().getName();
        }
    }

    // ... getters and setters
}