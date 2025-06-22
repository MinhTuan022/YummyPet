package com.example.yummypet.controller;

import com.example.yummypet.dto.request.ProductStockRequest;
import com.example.yummypet.dto.response.ApiResponse;
import com.example.yummypet.service.ProductStockService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product-stock")
@RequiredArgsConstructor
public class ProductStockController {

    private final ProductStockService productStockService;
    
    @PostMapping("/batch-update")
    public ResponseEntity<ApiResponse<Map<String, List<ProductStockRequest>>>> batchUpdateStock(
            @Valid @RequestBody List<ProductStockRequest> requests) {
        
        Map<String, List<ProductStockRequest>> result = productStockService.batchUpdateStock(requests);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật tồn kho hoàn tất", result));
    }
}
