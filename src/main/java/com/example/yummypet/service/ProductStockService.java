package com.example.yummypet.service;

import com.example.yummypet.dto.request.ProductStockRequest;
import com.example.yummypet.entity.Product;
import com.example.yummypet.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductStockService {

    private final ProductRepository productRepository;

    @Transactional
    public Map<String, List<ProductStockRequest>> batchUpdateStock(List<ProductStockRequest> requests) {
        List<ProductStockRequest> successList = new ArrayList<>();
        List<ProductStockRequest> failedList = new ArrayList<>();
        
        for (ProductStockRequest request : requests) {
            try {
                Product product = productRepository.findById(request.getProductId())
                        .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với ID: " + request.getProductId()));
                
                int newQuantity = product.getStockQuantity() + request.getQuantity();
                
                if (newQuantity < 0) {
                    throw new IllegalArgumentException("Số lượng sau khi cập nhật không thể âm");
                }
                
                product.setStockQuantity(newQuantity);
                product.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
                productRepository.save(product);
                
                successList.add(request);
                log.info("Cập nhật tồn kho thành công cho sản phẩm {}: {} -> {}", 
                        product.getId(), product.getStockQuantity() - request.getQuantity(), product.getStockQuantity());
                
            } catch (Exception e) {
                failedList.add(request);
                log.error("Lỗi khi cập nhật tồn kho cho sản phẩm {}: {}", request.getProductId(), e.getMessage());
            }
        }
        
        Map<String, List<ProductStockRequest>> result = new HashMap<>();
        result.put("success", successList);
        result.put("failed", failedList);
        
        return result;
    }

    public void checkLowStockProducts() {
        List<Product> lowStockProducts = productRepository.findProductsBelowMinStock();
        
        if (!lowStockProducts.isEmpty()) {
            log.info("Phát hiện {} sản phẩm sắp hết hàng", lowStockProducts.size());
        }
    }

    @Transactional
    public Product increaseStock(Integer productId, Integer quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Số lượng tăng phải lớn hơn 0");
        }
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với ID: " + productId));
        
        log.info("Tăng tồn kho sản phẩm {} ({}) thêm {} đơn vị", 
                product.getName(), product.getId(), quantity);
                
        product.setStockQuantity(product.getStockQuantity() + quantity);
        product.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        return productRepository.save(product);
    }
}
