//package com.example.yummypet.service;
//
//import com.example.yummypet.dto.response.product.ProductResponse;
//import com.example.yummypet.entity.Product;
//import com.example.yummypet.repository.ProductRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.domain.Sort;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//@Service
//@RequiredArgsConstructor
//@Slf4j
//@Transactional
//public class ProductService {
//    private final ProductRepository productRepository;
//
//
//    public Page<ProductResponse> getAllActiveProducts(int page, int size, String sortBy, String sortDir) {
//        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
//        Pageable pageable = PageRequest.of(page, size, sort);
//
//        Page<Product> products = productRepository.findByIsActiveTrue(pageable);
//        return products.map(this::mapEntityToResponse);
//    }
//
//    private ProductResponse mapEntityToResponse(Product product) {
//        ProductResponse response = new ProductResponse();
//        response.setId(product.getId());
//        response.setName(product.getName());
//        response.setDescription(product.getDescription());
//        response.setPrice(product.getPrice());
//        response.setStockQuantity(product.getStockQuantity());
////        response.setCategory(product.getCategory());
////        response.setBrand(product.getBrand());
////        response.setImageUrl(product.getImageUrl());
////        response.setStatus(product.getStatus());
////        response.setRating(product.getRating());
////        response.setReviewCount(product.getReviewCount());
//        response.setWeight(product.getWeight());
////        response.setTags(product.getTags());
////        response.setIsDiscounted(product.getIsDiscounted());
////        response.setDiscountPrice(product.getDiscountPrice());
////        response.setCreatedAt(product.getCreatedAt());
////        response.setUpdatedAt(product.getUpdatedAt());
////        response.setCreatedBy(product.getCreatedBy());
////        response.setUpdatedBy(product.getUpdatedBy());
////
////        // Calculate final price
////        if (product.getIsDiscounted() && product.getDiscountPrice() != null) {
////            response.setFinalPrice(product.getDiscountPrice());
////        } else {
////            response.setFinalPrice(product.getPrice());
////        }
//
//        return response;
//    }
//}
