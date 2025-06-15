package com.example.yummypet.controller;

import com.example.yummypet.dto.common.ApiResponse;
import com.example.yummypet.dto.request.service.ServiceCreateDTO;
import com.example.yummypet.dto.request.service.ServiceUpdateDTO;
import com.example.yummypet.dto.response.service.ServiceResponseDTO;
import com.example.yummypet.service.ServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.Parameter;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
//@Tag(name = "Service Management", description = "APIs for managing pet services")
public class ServiceController {

    private final ServiceService serviceService;

    @PostMapping
//    @Operation(summary = "Create a new service", description = "Create a new pet service")
    public ResponseEntity<ApiResponse<ServiceResponseDTO>> createService(
            @Valid @RequestBody ServiceCreateDTO createDto) {

        ServiceResponseDTO createdService = serviceService.createService(createDto);
        ApiResponse<ServiceResponseDTO> response = ApiResponse.success(
                "Service created successfully", createdService);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
//    @Operation(summary = "Get service by ID", description = "Retrieve a specific service by its ID")
    public ResponseEntity<ApiResponse<ServiceResponseDTO>> getServiceById(
            @PathVariable Long id) {

        ServiceResponseDTO service = serviceService.getServiceById(id);
        ApiResponse<ServiceResponseDTO> response = ApiResponse.success(
                "Service retrieved successfully", service);

        return ResponseEntity.ok(response);
    }

    @GetMapping
//    @Operation(summary = "Get all services", description = "Retrieve all services with pagination and sorting")
    public ResponseEntity<ApiResponse<Page<ServiceResponseDTO>>> getAllServices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Page<ServiceResponseDTO> services = serviceService.getAllServices(page, size, sortBy, sortDir);
        ApiResponse<Page<ServiceResponseDTO>> response = ApiResponse.success(
                "Services retrieved successfully", services);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/active")
//    @Operation(summary = "Get active services", description = "Retrieve all active services")
    public ResponseEntity<ApiResponse<List<ServiceResponseDTO>>> getActiveServices() {

        List<ServiceResponseDTO> services = serviceService.getActiveServices();
        ApiResponse<List<ServiceResponseDTO>> response = ApiResponse.success(
                "Active services retrieved successfully", services);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
//    @Operation(summary = "Search services", description = "Search services with various filters")
    public ResponseEntity<ApiResponse<Page<ServiceResponseDTO>>> searchServices(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Page<ServiceResponseDTO> services = serviceService.searchServices(
                name, isActive, minPrice, maxPrice, page, size, sortBy, sortDir);
        ApiResponse<Page<ServiceResponseDTO>> response = ApiResponse.success(
                "Services search completed successfully", services);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
//    @Operation(summary = "Update service", description = "Update an existing service")
    public ResponseEntity<ApiResponse<ServiceResponseDTO>> updateService(
            @PathVariable Long id,
            @Valid @RequestBody ServiceUpdateDTO updateDto) {

        ServiceResponseDTO updatedService = serviceService.updateService(id, updateDto);
        ApiResponse<ServiceResponseDTO> response = ApiResponse.success(
                "Service updated successfully", updatedService);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
//    @Operation(summary = "Delete service", description = "Soft delete a service (set as inactive)")
    public ResponseEntity<ApiResponse<Void>> deleteService(
            @PathVariable Long id) {

        serviceService.deleteService(id);
        ApiResponse<Void> response = ApiResponse.success("Service deleted successfully", null);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}/hard")
//    @Operation(summary = "Hard delete service", description = "Permanently delete a service from database")
    public ResponseEntity<ApiResponse<Void>> hardDeleteService(
            @PathVariable Long id) {

        serviceService.hardDeleteService(id);
        ApiResponse<Void> response = ApiResponse.success("Service permanently deleted", null);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/toggle-status")
//    @Operation(summary = "Toggle service status", description = "Activate or deactivate a service")
    public ResponseEntity<ApiResponse<ServiceResponseDTO>> toggleServiceStatus(
             @PathVariable Long id) {

        ServiceResponseDTO service = serviceService.toggleServiceStatus(id);
        ApiResponse<ServiceResponseDTO> response = ApiResponse.success(
                "Service status updated successfully", service);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/price-range")
//    @Operation(summary = "Get services by price range", description = "Retrieve services within a specific price range")
    public ResponseEntity<ApiResponse<List<ServiceResponseDTO>>> getServicesByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {

        List<ServiceResponseDTO> services = serviceService.getServicesByPriceRange(minPrice, maxPrice);
        ApiResponse<List<ServiceResponseDTO>> response = ApiResponse.success(
                "Services retrieved by price range successfully", services);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/duration-range")
//    @Operation(summary = "Get services by duration range", description = "Retrieve services within a specific duration range")
    public ResponseEntity<ApiResponse<List<ServiceResponseDTO>>> getServicesByDurationRange(
           @RequestParam Integer minDuration,
           @RequestParam Integer maxDuration) {

        List<ServiceResponseDTO> services = serviceService.getServicesByDurationRange(minDuration, maxDuration);
        ApiResponse<List<ServiceResponseDTO>> response = ApiResponse.success(
                "Services retrieved by duration range successfully", services);

        return ResponseEntity.ok(response);
    }
}