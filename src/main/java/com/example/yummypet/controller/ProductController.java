//package com.example.yummypet.controller;
//
//
//import com.example.yummypet.dto.request.JwtRequest;
//import com.example.yummypet.dto.response.JwtResponse;
//import com.example.yummypet.dto.response.product.ProductResponse;
//import com.example.yummypet.service.AuthService;
//import com.example.yummypet.service.ProductService;
//import com.example.yummypet.util.MessageResponse;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.data.domain.Page;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@Slf4j
//@CrossOrigin(origins = "*", maxAge = 3600)
//@RestController
//@RequestMapping("/api/public")
//@RequiredArgsConstructor
//public class ProductController {
//    private final ProductService productService;
//
//    @GetMapping
//    public ResponseEntity<Page<ProductResponse>> getAllActiveProducts(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size,
//            @RequestParam(defaultValue = "id") String sortBy,
//            @RequestParam(defaultValue = "asc") String sortDir
//    ) {
//        Page<ProductResponse> products = productService.getAllActiveProducts(page, size, sortBy, sortDir);
//        return ResponseEntity.ok(products);
//    }
//
//
//
//}
