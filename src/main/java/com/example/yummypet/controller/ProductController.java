package com.example.yummypet.controller;

import com.example.yummypet.dto.common.ApiResponse;
import com.example.yummypet.dto.request.product.ProductCreateDTO;
import com.example.yummypet.dto.request.product.ProductSearchCriteria;
import com.example.yummypet.dto.request.product.ProductUpdateDTO;
import com.example.yummypet.dto.response.product.ProductResponseDTO;
import com.example.yummypet.entity.Product;
import com.example.yummypet.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = "*")
@Validated
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponseDTO>> createProduct(
            @Valid @RequestBody ProductCreateDTO createDTO) {
        try {
            ProductResponseDTO product = productService.createProduct(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Tạo sản phẩm thành công", product));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Lỗi tạo sản phẩm: " + e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Dữ liệu không hợp lệ: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi hệ thống: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> updateProduct(
            @PathVariable Integer id,
            @Valid @RequestBody ProductUpdateDTO updateDTO) {
        try {
            ProductResponseDTO product = productService.updateProduct(id, updateDTO);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật sản phẩm thành công", product));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Không tìm thấy sản phẩm: " + e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Dữ liệu không hợp lệ: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi hệ thống: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> getProductById(@PathVariable Integer id) {
        try {
            ProductResponseDTO product = productService.getProductById(id);
            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin sản phẩm thành công", product));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Không tìm thấy sản phẩm: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Integer id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa sản phẩm thành công", null));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Không tìm thấy sản phẩm: " + e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Không thể xóa sản phẩm: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/hard")
    public ResponseEntity<ApiResponse<Void>> hardDeleteProduct(@PathVariable Integer id) {
        try {
            productService.hardDeleteProduct(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa vĩnh viễn sản phẩm thành công", null));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Không tìm thấy sản phẩm: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<ProductResponseDTO>>> searchProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) Boolean isPet,
            @RequestParam(required = false) Product.Gender gender,
            @RequestParam(required = false) String breed,
            @RequestParam(required = false) Integer minAge,
            @RequestParam(required = false) Integer maxAge,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        ProductSearchCriteria criteria = new ProductSearchCriteria();
        criteria.setKeyword(keyword);
        criteria.setCategoryId(categoryId);
        criteria.setMinPrice(minPrice);
        criteria.setMaxPrice(maxPrice);
        criteria.setIsActive(isActive);
//        criteria.setIsPet(isPet);
        criteria.setGender(gender);
        criteria.setBreed(breed);
        criteria.setMinAge(minAge);
        criteria.setMaxAge(maxAge);
        criteria.setPage(page);
        criteria.setSize(size);
        criteria.setSortBy(sortBy);
        criteria.setSortDir(sortDir);

        Page<ProductResponseDTO> products = productService.searchProducts(criteria);
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm sản phẩm thành công", products));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> getAllProducts() {
        List<ProductResponseDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách sản phẩm thành công", products));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> getActiveProducts() {
        List<ProductResponseDTO> products = productService.getActiveProducts();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách sản phẩm hoạt động thành công", products));
    }

    @GetMapping("/pets")
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> getPetProducts() {
        List<ProductResponseDTO> products = productService.getPetProducts();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách sản phẩm pet thành công", products));
    }

    @GetMapping("/non-pets")
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> getNonPetProducts() {
        List<ProductResponseDTO> products = productService.getNonPetProducts();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách sản phẩm không phải pet thành công", products));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> getProductsByCategory(
            @PathVariable Integer categoryId) {
        List<ProductResponseDTO> products = productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(ApiResponse.success("Lấy sản phẩm theo danh mục thành công", products));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> getLowStockProducts(
            @RequestParam(defaultValue = "10") Integer threshold) {
        List<ProductResponseDTO> products = productService.getLowStockProducts(threshold);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách sản phẩm sắp hết hàng thành công", products));
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> updateStock(
            @PathVariable Integer id,
            @RequestParam Integer quantity) {
        try {
            ProductResponseDTO product = productService.updateStock(id, quantity);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật tồn kho thành công", product));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Không tìm thấy sản phẩm: " + e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Dữ liệu không hợp lệ: " + e.getMessage()));
        }
    }

    @PatchMapping("/bulk-status")
    public ResponseEntity<ApiResponse<String>> bulkUpdateStatus(
            @RequestBody List<Integer> productIds,
            @RequestParam Boolean isActive) {
        try {
            int updatedCount = 0;
            for (Integer id : productIds) {
                try {
                    ProductUpdateDTO updateDTO = new ProductUpdateDTO();
                    updateDTO.setIsActive(isActive);
                    productService.updateProduct(id, updateDTO);
                    updatedCount++;
                } catch (EntityNotFoundException ignored) {
                }
            }
            return ResponseEntity.ok(ApiResponse.success(
                    "Cập nhật trạng thái thành công cho " + updatedCount + " sản phẩm",
                    updatedCount + " sản phẩm đã được cập nhật"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi hệ thống: " + e.getMessage()));
        }
    }

    @PatchMapping("/bulk-type")
    public ResponseEntity<ApiResponse<String>> bulkUpdateType(
            @RequestBody List<Integer> productIds,
            @RequestParam Boolean isPet) {
        try {
            int updatedCount = 0;
            int failedCount = 0;
            StringBuilder errorMessages = new StringBuilder();

            for (Integer id : productIds) {
                try {
                    ProductUpdateDTO updateDTO = new ProductUpdateDTO();
                    updateDTO.setIsPet(isPet);
                    productService.updateProduct(id, updateDTO);
                    updatedCount++;
                } catch (EntityNotFoundException e) {
                    failedCount++;
                    errorMessages.append("ID ").append(id).append(": Không tìm thấy; ");
                } catch (Exception e) {
                    failedCount++;
                    errorMessages.append("ID ").append(id).append(": ").append(e.getMessage()).append("; ");
                }
            }

            String message = "Cập nhật loại sản phẩm thành công cho " + updatedCount + " sản phẩm";
            if (failedCount > 0) {
                message += ". Thất bại: " + failedCount + " sản phẩm. Chi tiết: " + errorMessages.toString();
            }

            return ResponseEntity.ok(ApiResponse.success(message,
                    updatedCount + " sản phẩm đã được cập nhật"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi hệ thống: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> uploadProductImage(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file) {
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("File không được để trống"));
            }

            // Check file size (max 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("File không được vượt quá 5MB"));
            }

            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Chỉ chấp nhận file hình ảnh"));
            }

            // TODO: Implement file upload logic (save to server/cloud storage)

            String imageUrl = "/uploads/products/" + id + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

            ProductUpdateDTO updateDTO = new ProductUpdateDTO();
            updateDTO.setImageUrl(imageUrl);
            ProductResponseDTO product = productService.updateProduct(id, updateDTO);

            return ResponseEntity.ok(ApiResponse.success("Upload hình ảnh thành công", product));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Không tìm thấy sản phẩm: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi upload file: " + e.getMessage()));
        }
    }
}