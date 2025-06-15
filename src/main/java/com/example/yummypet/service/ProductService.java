package com.example.yummypet.service;

import com.example.yummypet.dto.request.product.ProductCreateDTO;
import com.example.yummypet.dto.request.product.ProductSearchCriteria;
import com.example.yummypet.dto.request.product.ProductUpdateDTO;
import com.example.yummypet.dto.response.product.ProductResponseDTO;
import com.example.yummypet.entity.Category;
import com.example.yummypet.entity.Order;
import com.example.yummypet.entity.Product;
import com.example.yummypet.enums.OrderStatus;
import com.example.yummypet.repository.CategoryRepository;
import com.example.yummypet.repository.ProductRepository;
import com.example.yummypet.specification.ProductSpecifications;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public ProductResponseDTO createProduct(ProductCreateDTO createDTO) {
        Category category = categoryRepository.findById(createDTO.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với ID: " + createDTO.getCategoryId()));

        if (!category.getIsActive()) {
            throw new IllegalArgumentException("Danh mục đã bị vô hiệu hóa");
        }

        validateProductFields(createDTO);

        Product product = new Product();

        product.setName(createDTO.getName());
        product.setDescription(createDTO.getDescription());
        product.setPrice(createDTO.getPrice());
        product.setStockQuantity(createDTO.getStockQuantity());
        product.setImageUrl(createDTO.getImageUrl());
        product.setIsPet(createDTO.getIsPet() != null ? createDTO.getIsPet() : true);
        product.setIsActive(createDTO.getIsActive() != null ? createDTO.getIsActive() : true);
        product.setCategory(category);

        if (product.getIsPet()) {
            product.setAgeMonths(createDTO.getAgeMonths());
            product.setBreed(createDTO.getBreed());
            product.setColor(createDTO.getColor());
            product.setGender(createDTO.getGender());
            product.setHealthStatus(createDTO.getHealthStatus());
            product.setVaccinationStatus(createDTO.getVaccinationStatus());
            product.setCertificateInfo(createDTO.getCertificateInfo());
            product.setWeight(createDTO.getWeight());

            product.setBarcode(null);
            product.setBarcodeType(null);
            product.setSku(null);
        } else {
            product.setBarcode(createDTO.getBarcode());
            product.setBarcodeType(createDTO.getBarcodeType());
            product.setSku(createDTO.getSku());

            product.setAgeMonths(null);
            product.setBreed(null);
            product.setColor(null);
            product.setGender(null);
            product.setHealthStatus(null);
            product.setVaccinationStatus(null);
            product.setCertificateInfo(null);
            product.setWeight(null);
        }

        if (!product.getIsPet()) {
            validateUniqueConstraints(createDTO, null);
        }

        Product savedProduct = productRepository.save(product);
        return new ProductResponseDTO(savedProduct);
    }

    public ProductResponseDTO updateProduct(Integer id, ProductUpdateDTO updateDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với ID: " + id));

        // Update common fields
        if (updateDTO.getName() != null) {
            product.setName(updateDTO.getName());
        }
        if (updateDTO.getDescription() != null) {
            product.setDescription(updateDTO.getDescription());
        }
        if (updateDTO.getPrice() != null) {
            product.setPrice(updateDTO.getPrice());
        }
        if (updateDTO.getStockQuantity() != null) {
            product.setStockQuantity(updateDTO.getStockQuantity());
        }
        if (updateDTO.getImageUrl() != null) {
            product.setImageUrl(updateDTO.getImageUrl());
        }
        if (updateDTO.getIsActive() != null) {
            product.setIsActive(updateDTO.getIsActive());
        }

        // Handle category update
        if (updateDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(updateDTO.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với ID: " + updateDTO.getCategoryId()));
            product.setCategory(category);
        }

        // Handle isPet field change
        if (updateDTO.getIsPet() != null && !updateDTO.getIsPet().equals(product.getIsPet())) {
            product.setIsPet(updateDTO.getIsPet());

            if (updateDTO.getIsPet()) {
                // Changing to pet - clear non-pet fields
                product.setBarcode(null);
                product.setBarcodeType(null);
                product.setSku(null);
            } else {
                // Changing to non-pet - clear pet fields
                product.setAgeMonths(null);
                product.setBreed(null);
                product.setColor(null);
                product.setGender(null);
                product.setHealthStatus(null);
                product.setVaccinationStatus(null);
                product.setCertificateInfo(null);
                product.setWeight(null);
            }
        }

        // Update fields based on current product type
        if (product.getIsPet()) {
            // Update pet-specific fields
            if (updateDTO.getAgeMonths() != null) {
                product.setAgeMonths(updateDTO.getAgeMonths());
            }
            if (updateDTO.getBreed() != null) {
                product.setBreed(updateDTO.getBreed());
            }
            if (updateDTO.getColor() != null) {
                product.setColor(updateDTO.getColor());
            }
            if (updateDTO.getGender() != null) {
                product.setGender(updateDTO.getGender());
            }
            if (updateDTO.getHealthStatus() != null) {
                product.setHealthStatus(updateDTO.getHealthStatus());
            }
            if (updateDTO.getVaccinationStatus() != null) {
                product.setVaccinationStatus(updateDTO.getVaccinationStatus());
            }
            if (updateDTO.getCertificateInfo() != null) {
                product.setCertificateInfo(updateDTO.getCertificateInfo());
            }
            if (updateDTO.getWeight() != null) {
                product.setWeight(updateDTO.getWeight());
            }
        } else {
            // Update non-pet fields
            if (updateDTO.getBarcode() != null) {
                product.setBarcode(updateDTO.getBarcode());
            }
            if (updateDTO.getBarcodeType() != null) {
                product.setBarcodeType(updateDTO.getBarcodeType());
            }
            if (updateDTO.getSku() != null) {
                product.setSku(updateDTO.getSku());
            }

            // Validate unique constraints for non-pet products
            validateUniqueConstraints(updateDTO, id);
        }

        Product savedProduct = productRepository.save(product);
        return new ProductResponseDTO(savedProduct);
    }

    // Get Product by ID
    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với ID: " + id));
        return new ProductResponseDTO(product);
    }

    // Delete Product (Soft Delete)
    public void deleteProduct(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với ID: " + id));

        // Check if product is in any active orders
        boolean hasActiveOrders = product.getOrderItems().stream()
                .anyMatch(orderItem -> !orderItem.getOrder().getStatus().equals(OrderStatus.CANCELLED));

        if (hasActiveOrders) {
            throw new IllegalStateException("Không thể xóa sản phẩm đang có trong đơn hàng");
        }

        // Soft delete
        product.setIsActive(false);
        productRepository.save(product);
    }

    // Hard Delete (Admin only)
    public void hardDeleteProduct(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với ID: " + id));

        productRepository.delete(product);
    }

    // Search Products with Pagination
    @Transactional(readOnly = true)
    public Page<ProductResponseDTO> searchProducts(ProductSearchCriteria criteria) {
        Specification<Product> spec = Specification.where(null);

        spec = spec.and(ProductSpecifications.hasKeyword(criteria.getKeyword()));
        spec = spec.and(ProductSpecifications.hasCategory(criteria.getCategoryId()));
        spec = spec.and(ProductSpecifications.hasPriceRange(criteria.getMinPrice(), criteria.getMaxPrice()));
        spec = spec.and(ProductSpecifications.hasActiveStatus(criteria.getIsActive()));
        spec = spec.and(ProductSpecifications.hasGender(criteria.getGender()));
        spec = spec.and(ProductSpecifications.hasBreed(criteria.getBreed()));
        spec = spec.and(ProductSpecifications.hasAgeRange(criteria.getMinAge(), criteria.getMaxAge()));
//        spec = spec.and(ProductSpecifications.hasPetStatus(criteria.getIsPet()));

        Sort sort = Sort.by(
                criteria.getSortDir().equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC,
                criteria.getSortBy()
        );

        Pageable pageable = PageRequest.of(criteria.getPage(), criteria.getSize(), sort);

        Page<Product> productPage = productRepository.findAll(spec, pageable);
        return productPage.map(ProductResponseDTO::new);
    }

    // Get All Products
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(ProductResponseDTO::new)
                .collect(Collectors.toList());
    }

    // Get Active Products
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getActiveProducts() {
        List<Product> products = productRepository.findByIsActiveTrue();
        return products.stream()
                .map(ProductResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getPetProducts() {
        List<Product> products = productRepository.findByIsPetTrue();
        return products.stream()
                .map(ProductResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getNonPetProducts() {
        List<Product> products = productRepository.findByIsPetFalse();
        return products.stream()
                .map(ProductResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getProductsByCategory(Integer categoryId) {
        List<Product> products = productRepository.findByCategoryId(categoryId);
        return products.stream()
                .map(ProductResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getLowStockProducts(Integer threshold) {
        List<Product> products = productRepository.findByStockQuantityLessThan(threshold);
        return products.stream()
                .map(ProductResponseDTO::new)
                .collect(Collectors.toList());
    }

    public ProductResponseDTO updateStock(Integer id, Integer quantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với ID: " + id));

        if (quantity < 0) {
            throw new IllegalArgumentException("Số lượng tồn kho không được âm");
        }

        product.setStockQuantity(quantity);
        Product savedProduct = productRepository.save(product);
        return new ProductResponseDTO(savedProduct);
    }

//    // Find product by barcode
//    @Transactional(readOnly = true)
//    public ProductResponseDTO findByBarcode(String barcode) {
//        return productRepository.findByBarcode(barcode)
//                .map(ProductResponseDTO::new)
//                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với barcode: " + barcode));
//    }
//
//    // Find product by SKU
//    @Transactional(readOnly = true)
//    public ProductResponseDTO findBySku(String sku) {
//        return productRepository.findBySku(sku)
//                .map(ProductResponseDTO::new)
//                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với SKU: " + sku));
//    }

    private void validateProductFields(ProductCreateDTO createDTO) {
        Boolean isPet = createDTO.getIsPet() != null ? createDTO.getIsPet() : true;

        if (isPet) {
            if (createDTO.getAgeMonths() == null) {
                throw new IllegalArgumentException("Tuổi là bắt buộc đối với thú cưng");
            }
            if (createDTO.getBreed() == null || createDTO.getBreed().trim().isEmpty()) {
                throw new IllegalArgumentException("Giống là bắt buộc đối với thú cưng");
            }
            if (createDTO.getGender() == null) {
                throw new IllegalArgumentException("Giới tính là bắt buộc đối với thú cưng");
            }
        }
    }

    private void validateUniqueConstraints(Object dto, Integer excludeId) {
        String barcode = null;
        String sku = null;

        if (dto instanceof ProductCreateDTO) {
            ProductCreateDTO createDTO = (ProductCreateDTO) dto;
            barcode = createDTO.getBarcode();
            sku = createDTO.getSku();
        } else if (dto instanceof ProductUpdateDTO) {
            ProductUpdateDTO updateDTO = (ProductUpdateDTO) dto;
            barcode = updateDTO.getBarcode();
            sku = updateDTO.getSku();
        }

        if (barcode != null && !barcode.trim().isEmpty()) {
            boolean barcodeExists = excludeId != null
                    ? productRepository.existsByBarcodeAndIdNot(barcode, excludeId)
                    : productRepository.existsByBarcode(barcode);

            if (barcodeExists) {
                throw new IllegalArgumentException("Barcode đã tồn tại: " + barcode);
            }
        }

        if (sku != null && !sku.trim().isEmpty()) {
            boolean skuExists = excludeId != null
                    ? productRepository.existsBySkuAndIdNot(sku, excludeId)
                    : productRepository.existsBySku(sku);

            if (skuExists) {
                throw new IllegalArgumentException("SKU đã tồn tại: " + sku);
            }
        }
    }
}