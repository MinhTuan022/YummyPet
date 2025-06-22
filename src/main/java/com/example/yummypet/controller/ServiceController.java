package com.example.yummypet.controller;

import com.example.yummypet.dto.ApiResponse;
import com.example.yummypet.dto.request.ServiceRequest;
import com.example.yummypet.dto.response.ServiceDTO;
import com.example.yummypet.entity.Service;
import com.example.yummypet.service.ServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ServiceDTO>>> getAllServices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir,
            @RequestParam(required = false) Boolean onlyActive) {
        
        Sort sort = sortDir.equalsIgnoreCase("DESC") ? 
                Sort.by(sortBy == null ? "id" : sortBy).descending() : 
                Sort.by(sortBy == null ? "id" : sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Service> services;
        
        if (onlyActive != null && onlyActive) {
            services = serviceService.getActiveServices(pageable);
        } else {
            services = serviceService.getAllServices(pageable);
        }
        
        Page<ServiceDTO> serviceDTOs = services.map(ServiceDTO::fromService);
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy danh sách dịch vụ thành công",
                serviceDTOs
        ));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceDTO>> getServiceById(@PathVariable Integer id) {
        Service service = serviceService.getServiceById(id);
        ServiceDTO serviceDTO = ServiceDTO.fromService(service);
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy thông tin dịch vụ thành công",
                serviceDTO
        ));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<ServiceDTO>>> searchServices(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer minDuration,
            @RequestParam(required = false) Integer maxDuration,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("DESC") ? 
                Sort.by(sortBy).descending() : 
                Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Service> services = serviceService.searchServices(
                name, minPrice, maxPrice, minDuration, maxDuration, isActive, pageable);
        
        Page<ServiceDTO> serviceDTOs = services.map(ServiceDTO::fromService);
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Tìm kiếm dịch vụ thành công",
                serviceDTOs
        ));
    }
    
    @GetMapping("/price/asc")
    public ResponseEntity<ApiResponse<List<ServiceDTO>>> getServicesByPriceAsc() {
        List<Service> services = serviceService.getServicesByPriceAsc();
        List<ServiceDTO> serviceDTOs = ServiceDTO.fromServices(services);
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy danh sách dịch vụ theo giá tăng dần thành công",
                serviceDTOs
        ));
    }
    
    @GetMapping("/price/desc")
    public ResponseEntity<ApiResponse<List<ServiceDTO>>> getServicesByPriceDesc() {
        List<Service> services = serviceService.getServicesByPriceDesc();
        List<ServiceDTO> serviceDTOs = ServiceDTO.fromServices(services);
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy danh sách dịch vụ theo giá giảm dần thành công",
                serviceDTOs
        ));
    }
    
    @GetMapping("/top-booked")
    public ResponseEntity<ApiResponse<List<ServiceDTO>>> getTopBookedServices(
            @RequestParam(defaultValue = "5") int limit) {
        List<Service> services = serviceService.getTopBookedServices(limit);
        List<ServiceDTO> serviceDTOs = ServiceDTO.fromServices(services);
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy danh sách dịch vụ được đặt nhiều nhất thành công",
                serviceDTOs
        ));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<ServiceDTO>> createService(@Valid @RequestBody ServiceRequest request) {
        Service createdService = serviceService.createService(request);
        ServiceDTO serviceDTO = ServiceDTO.fromService(createdService);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                true,
                "Tạo dịch vụ thành công",
                serviceDTO
        ));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceDTO>> updateService(
            @PathVariable Integer id,
            @Valid @RequestBody ServiceRequest request) {
        Service updatedService = serviceService.updateService(id, request);
        ServiceDTO serviceDTO = ServiceDTO.fromService(updatedService);
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Cập nhật dịch vụ thành công",
                serviceDTO
        ));
    }
    
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<ServiceDTO>> toggleServiceStatus(@PathVariable Integer id) {
        Service updatedService = serviceService.toggleServiceStatus(id);
        ServiceDTO serviceDTO = ServiceDTO.fromService(updatedService);
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                updatedService.getIsActive() ? "Kích hoạt dịch vụ thành công" : "Vô hiệu hóa dịch vụ thành công",
                serviceDTO
        ));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteService(@PathVariable Integer id) {
        serviceService.deleteService(id);
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Xóa dịch vụ thành công",
                null
        ));
    }
}
