package com.example.yummypet.dto.response;

import com.example.yummypet.entity.Product;
import com.example.yummypet.entity.ProductImage;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class ProductDTO {
    private Integer id;
    private Integer categoryId;
    private String categoryName;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal costPrice;
    private Integer stockQuantity;
    private Integer minStockLevel;
    private String sku;
    private String barcode;
    private BigDecimal weight;
    private String brand;
    private String originCountry;
    private LocalDate expiryDate;
    private String imageUrl; // Legacy field
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Thêm hỗ trợ cho nhiều hình ảnh
    private List<ProductImageDTO> images;
    private String primaryImageUrl;
    
    private String stockStatus; 
      public static ProductDTO fromProduct(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }
        
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setCostPrice(product.getCostPrice());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setMinStockLevel(product.getMinStockLevel());
        dto.setSku(product.getSku());
        dto.setBarcode(product.getBarcode());
        dto.setWeight(product.getWeight());
        dto.setBrand(product.getBrand());
        dto.setOriginCountry(product.getOriginCountry());
        dto.setExpiryDate(product.getExpiryDate());
        dto.setImageUrl(product.getImageUrl()); // Legacy support
        dto.setIsActive(product.getIsActive());
        
        if (product.getCreatedAt() != null) {
            dto.setCreatedAt(product.getCreatedAt().toLocalDateTime());
        }
        
        if (product.getUpdatedAt() != null) {
            dto.setUpdatedAt(product.getUpdatedAt().toLocalDateTime());
        }
        
        if (product.getStockQuantity() <= 0) {
            dto.setStockStatus("Out of Stock");
        } else if (product.getStockQuantity() <= product.getMinStockLevel()) {
            dto.setStockStatus("Low Stock");
        } else {
            dto.setStockStatus("In Stock");
        }
        
        return dto;
    }
    
    public static ProductDTO fromProductWithImages(Product product, List<ProductImage> images) {
        ProductDTO dto = fromProduct(product);
        
        if (images != null && !images.isEmpty()) {
            dto.setImages(images.stream()
                    .map(ProductImageDTO::fromProductImage)
                    .collect(Collectors.toList()));
            
            // Tìm và thiết lập hình ảnh chính
            images.stream()
                    .filter(ProductImage::getIsPrimary)
                    .findFirst()
                    .ifPresent(primaryImage -> dto.setPrimaryImageUrl(primaryImage.getImageUrl()));
            
            // Nếu không có hình ảnh nào được đánh dấu là chính, sử dụng hình ảnh đầu tiên
            if (dto.getPrimaryImageUrl() == null && !images.isEmpty()) {
                dto.setPrimaryImageUrl(images.get(0).getImageUrl());
            }
        }
        
        return dto;
    }
    
    public static List<ProductDTO> fromProducts(List<Product> products) {
        return products.stream()
                .map(ProductDTO::fromProduct)
                .collect(Collectors.toList());
    }
}
