package com.example.yummypet.service;

import com.example.yummypet.dto.request.ProductRequest;
import com.example.yummypet.entity.Category;
import com.example.yummypet.entity.Product;
import com.example.yummypet.entity.ProductImage;
import com.example.yummypet.repository.CategoryRepository;
import com.example.yummypet.repository.ProductImageRepository;
import com.example.yummypet.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final CategoryRepository categoryRepository;
    
    @Transactional(readOnly = true)
    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<Product> searchProducts(
            String name, 
            Integer categoryId, 
            BigDecimal minPrice, 
            BigDecimal maxPrice, 
            String brand, 
            Boolean isActive, 
            Pageable pageable) {
        return productRepository.findByFilters(name, categoryId, minPrice, maxPrice, brand, isActive, pageable);
    }
    
    @Transactional(readOnly = true)
    public Product getProductById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với ID: " + id));
    }
    
    @Transactional(readOnly = true)
    public Product getProductBySku(String sku) {
        return productRepository.findBySku(sku)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với SKU: " + sku));
    }
    
    @Transactional(readOnly = true)
    public Product getProductByBarcode(String barcode) {
        return productRepository.findByBarcode(barcode)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với mã vạch: " + barcode));
    }
    
    @Transactional(readOnly = true)
    public List<Product> getProductsByCategory(Integer categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }
    
    @Transactional(readOnly = true)
    public Page<Product> getProductsByCategory(Integer categoryId, Pageable pageable) {
        return productRepository.findByCategoryId(categoryId, pageable);
    }
      @Transactional(readOnly = true)
    public List<Product> getLowStockProducts() {
        return productRepository.findProductsBelowMinStock();
    }
    
    @Transactional(readOnly = true)
    public List<Product> getOutOfStockProducts() {
        return productRepository.findOutOfStockProducts();
    }
    
    @Transactional(readOnly = true)
    public List<Product> getExpiredProducts() {
        return productRepository.findExpiredProducts(LocalDate.now());
    }
      @Transactional(readOnly = true)
    public List<Product> getTopSellingProducts(int limit) {
        return productRepository.findTopProducts(limit);
    }
    
    @Transactional
    public Product createProduct(ProductRequest request) {
        // Kiểm tra SKU trùng lặp nếu có cung cấp
        if (StringUtils.hasText(request.getSku())) {
            Optional<Product> existingProduct = productRepository.findBySku(request.getSku());
            if (existingProduct.isPresent()) {
                throw new IllegalArgumentException("SKU đã tồn tại trong hệ thống");
            }
        }
        
        // Kiểm tra barcode trùng lặp nếu có cung cấp
        if (StringUtils.hasText(request.getBarcode())) {
            Optional<Product> existingProduct = productRepository.findByBarcode(request.getBarcode());
            if (existingProduct.isPresent()) {
                throw new IllegalArgumentException("Mã vạch đã tồn tại trong hệ thống");
            }
        }
        
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với ID: " + request.getCategoryId()));
        
        Product product = new Product();
        updateProductFromRequest(product, request, category);
        
        Timestamp now = new Timestamp(System.currentTimeMillis());
        product.setCreatedAt(now);
        product.setUpdatedAt(now);
        
        return productRepository.save(product);
    }
    
    @Transactional
    public Product updateProduct(Integer id, ProductRequest request) {
        Product product = getProductById(id);
        
        if (StringUtils.hasText(request.getSku()) && !request.getSku().equals(product.getSku())) {
            Optional<Product> existingProduct = productRepository.findBySku(request.getSku());
            if (existingProduct.isPresent() && !existingProduct.get().getId().equals(id)) {
                throw new IllegalArgumentException("SKU đã tồn tại trong hệ thống");
            }
        }
        
        if (StringUtils.hasText(request.getBarcode()) && !request.getBarcode().equals(product.getBarcode())) {
            Optional<Product> existingProduct = productRepository.findByBarcode(request.getBarcode());
            if (existingProduct.isPresent() && !existingProduct.get().getId().equals(id)) {
                throw new IllegalArgumentException("Mã vạch đã tồn tại trong hệ thống");
            }
        }
        
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với ID: " + request.getCategoryId()));
        
        updateProductFromRequest(product, request, category);
        product.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        
        return productRepository.save(product);
    }
    
    @Transactional
    public Product updateProductStock(Integer id, Integer quantity) {
        Product product = getProductById(id);
        
        if (quantity < 0 && Math.abs(quantity) > product.getStockQuantity()) {
            throw new IllegalArgumentException("Số lượng giảm không thể lớn hơn số lượng tồn kho hiện tại");
        }
        
        product.setStockQuantity(product.getStockQuantity() + quantity);
        product.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        
        return productRepository.save(product);
    }
    
    @Transactional
    public Product toggleProductStatus(Integer id) {
        Product product = getProductById(id);
        product.setIsActive(!product.getIsActive());
        product.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        
        return productRepository.save(product);
    }
      @Transactional
    public void deleteProduct(Integer id) {
        Product product = getProductById(id);
        product.setIsActive(false);
        product.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        productRepository.save(product);
    }
    
    @Transactional(readOnly = true)
    public List<ProductImage> getProductImages(Integer productId) {
        Product product = getProductById(productId);
        return productImageRepository.findByProductOrderByDisplayOrderAsc(product);
    }
    
    private void updateProductFromRequest(Product product, ProductRequest request, Category category) {
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCostPrice(request.getCostPrice());
        product.setCategory(category);
        product.setStockQuantity(request.getStockQuantity());
        product.setMinStockLevel(request.getMinStockLevel());
        product.setSku(request.getSku());
        product.setBarcode(request.getBarcode());
        product.setWeight(request.getWeight());
        product.setBrand(request.getBrand());
        product.setOriginCountry(request.getOriginCountry());
        product.setExpiryDate(request.getExpiryDate());
        product.setImageUrl(request.getImageUrl());
        product.setIsActive(request.getIsActive());
    }
}
