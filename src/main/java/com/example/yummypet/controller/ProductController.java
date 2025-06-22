package com.example.yummypet.controller;

import com.example.yummypet.dto.request.ProductRequest;
import com.example.yummypet.dto.response.ApiResponse;
import com.example.yummypet.dto.response.ProductDTO;
import com.example.yummypet.entity.Product;
import com.example.yummypet.entity.ProductImage;
import com.example.yummypet.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
      @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductDTO>>> getAllProducts(Pageable pageable) {
        Page<Product> products = productService.getAllProducts(pageable);
        
        // Chuyển đổi và thêm hình ảnh chính cho mỗi sản phẩm
        List<ProductDTO> productDTOs = products.getContent().stream().map(product -> {
            List<ProductImage> images = productService.getProductImages(product.getId());
            return ProductDTO.fromProductWithImages(product, images);
        }).toList();
        
        Page<ProductDTO> productDTOPage = new PageImpl<>(productDTOs, pageable, products.getTotalElements());
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Danh sách sản phẩm", productDTOPage));
    }
      @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<ProductDTO>>> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Boolean isActive,
            Pageable pageable) {
        
        Page<Product> products = productService.searchProducts(name, categoryId, minPrice, maxPrice, brand, isActive, pageable);
        
        // Chuyển đổi và thêm hình ảnh chính cho mỗi sản phẩm
        List<ProductDTO> productDTOs = products.getContent().stream().map(product -> {
            List<ProductImage> images = productService.getProductImages(product.getId());
            return ProductDTO.fromProductWithImages(product, images);
        }).toList();
        
        Page<ProductDTO> productDTOPage = new PageImpl<>(productDTOs, pageable, products.getTotalElements());
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Kết quả tìm kiếm sản phẩm", productDTOPage));
    }
      @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> getProductById(@PathVariable Integer id) {
        Product product = productService.getProductById(id);
        List<ProductImage> images = productService.getProductImages(id);
        ProductDTO productDTO = ProductDTO.fromProductWithImages(product, images);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Thông tin chi tiết sản phẩm", productDTO));
    }
    
    @GetMapping("/sku/{sku}")
    public ResponseEntity<ApiResponse<ProductDTO>> getProductBySku(@PathVariable String sku) {
        Product product = productService.getProductBySku(sku);
        ProductDTO productDTO = ProductDTO.fromProduct(product);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Thông tin chi tiết sản phẩm", productDTO));
    }
    
    @GetMapping("/barcode/{barcode}")
    public ResponseEntity<ApiResponse<ProductDTO>> getProductByBarcode(@PathVariable String barcode) {
        Product product = productService.getProductByBarcode(barcode);
        ProductDTO productDTO = ProductDTO.fromProduct(product);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Thông tin chi tiết sản phẩm", productDTO));
    }
      @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<Page<ProductDTO>>> getProductsByCategory(
            @PathVariable Integer categoryId,
            Pageable pageable) {
        
        Page<Product> products = productService.getProductsByCategory(categoryId, pageable);
        
        // Chuyển đổi và thêm hình ảnh chính cho mỗi sản phẩm
        List<ProductDTO> productDTOs = products.getContent().stream().map(product -> {
            List<ProductImage> images = productService.getProductImages(product.getId());
            return ProductDTO.fromProductWithImages(product, images);
        }).toList();
        
        Page<ProductDTO> productDTOPage = new PageImpl<>(productDTOs, pageable, products.getTotalElements());
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Danh sách sản phẩm theo danh mục", productDTOPage));
    }
      @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getLowStockProducts() {
        List<Product> products = productService.getLowStockProducts();
        
        // Chuyển đổi và thêm hình ảnh chính cho mỗi sản phẩm
        List<ProductDTO> productDTOs = products.stream().map(product -> {
            List<ProductImage> images = productService.getProductImages(product.getId());
            return ProductDTO.fromProductWithImages(product, images);
        }).toList();
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Danh sách sản phẩm sắp hết hàng", productDTOs));
    }
    
    @GetMapping("/out-of-stock")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getOutOfStockProducts() {
        List<Product> products = productService.getOutOfStockProducts();
        
        // Chuyển đổi và thêm hình ảnh chính cho mỗi sản phẩm
        List<ProductDTO> productDTOs = products.stream().map(product -> {
            List<ProductImage> images = productService.getProductImages(product.getId());
            return ProductDTO.fromProductWithImages(product, images);
        }).toList();
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Danh sách sản phẩm hết hàng", productDTOs));
    }
      @GetMapping("/expired")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getExpiredProducts() {
        List<Product> products = productService.getExpiredProducts();
        
        // Chuyển đổi và thêm hình ảnh chính cho mỗi sản phẩm
        List<ProductDTO> productDTOs = products.stream().map(product -> {
            List<ProductImage> images = productService.getProductImages(product.getId());
            return ProductDTO.fromProductWithImages(product, images);
        }).toList();
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Danh sách sản phẩm hết hạn", productDTOs));
    }
    
    @GetMapping("/top-selling")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getTopSellingProducts(
            @RequestParam(defaultValue = "10") int limit) {
        
        List<Product> products = productService.getTopSellingProducts(limit);
        
        // Chuyển đổi và thêm hình ảnh chính cho mỗi sản phẩm
        List<ProductDTO> productDTOs = products.stream().map(product -> {
            List<ProductImage> images = productService.getProductImages(product.getId());
            return ProductDTO.fromProductWithImages(product, images);
        }).toList();
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Danh sách sản phẩm bán chạy nhất", productDTOs));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<ProductDTO>> createProduct(@Valid @RequestBody ProductRequest request) {
        Product product = productService.createProduct(request);
        ProductDTO productDTO = ProductDTO.fromProduct(product);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Tạo sản phẩm thành công", productDTO));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> updateProduct(
            @PathVariable Integer id,
            @Valid @RequestBody ProductRequest request) {
        
        Product product = productService.updateProduct(id, request);
        ProductDTO productDTO = ProductDTO.fromProduct(product);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật sản phẩm thành công", productDTO));
    }
    
    @PutMapping("/{id}/stock")
    public ResponseEntity<ApiResponse<ProductDTO>> updateProductStock(
            @PathVariable Integer id,
            @RequestParam Integer quantity) {
        
        Product product = productService.updateProductStock(id, quantity);
        ProductDTO productDTO = ProductDTO.fromProduct(product);
        
        String message = quantity >= 0 
                ? "Đã thêm " + quantity + " sản phẩm vào kho" 
                : "Đã giảm " + Math.abs(quantity) + " sản phẩm khỏi kho";
        
        return ResponseEntity.ok(new ApiResponse<>(true, message, productDTO));
    }
    
    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<ProductDTO>> toggleProductStatus(@PathVariable Integer id) {
        Product product = productService.toggleProductStatus(id);
        ProductDTO productDTO = ProductDTO.fromProduct(product);
        
        String message = product.getIsActive() 
                ? "Đã kích hoạt sản phẩm" 
                : "Đã vô hiệu hóa sản phẩm";
        
        return ResponseEntity.ok(new ApiResponse<>(true, message, productDTO));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Đã vô hiệu hóa sản phẩm thành công", null));
    }
}
