package com.example.yummypet.dto.response.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private String shortDescription;
    private String sku;

    private String brandName;
    private String categoryName;
    private String petCategoryName;

    private BigDecimal price;
    private BigDecimal salePrice;
    private BigDecimal weight;
    private String weightUnit;

    private String ingredients;
    private String nutritionalInfo;

    private String ageGroup;
    private String sizeGroup;

    private Integer stockQuantity;
    private Integer minStockLevel;
    private Boolean isActive;
    private Boolean isFeatured;

    private String metaTitle;
    private String metaDescription;

    private List<String> imageUrls;

}
