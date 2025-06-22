package com.example.yummypet.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductStatisticsDTO {
    private Integer productId;
    private String productName;
    private String categoryName;
    private Long totalSold;
    private Integer stockQuantity; 
    private BigDecimal revenue; 
    private BigDecimal profit; 
    
    private Long lowStockCount; 
    private Integer totalProducts; 
}
