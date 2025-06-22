package com.example.yummypet.controller;

import com.example.yummypet.dto.ApiResponse;
import com.example.yummypet.dto.request.CreateVoucherRequest;
import com.example.yummypet.dto.request.UpdateVoucherRequest;
import com.example.yummypet.dto.request.ValidateVoucherRequest;
import com.example.yummypet.dto.response.VoucherResponse;
import com.example.yummypet.dto.response.VoucherValidationResponse;
import com.example.yummypet.entity.Voucher;
import com.example.yummypet.service.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
public class VoucherController {
    
    private final VoucherService voucherService;

    @GetMapping
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiResponse<Page<VoucherResponse>>> getAllVouchers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = Sort.by(sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<VoucherResponse> voucherPage = voucherService.getAllVouchers(pageable)
                .map(voucher -> voucherService.mapVoucherToResponse(voucher));
        
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách voucher thành công", voucherPage));
    }
    

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<VoucherResponse>>> getActiveVouchers() {
        List<VoucherResponse> vouchers = voucherService.getActiveVouchers().stream()
                .map(voucher -> voucherService.mapVoucherToResponse(voucher))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách voucher hiệu lực thành công", vouchers));
    }

    @GetMapping("/valid")
    public ResponseEntity<ApiResponse<List<VoucherResponse>>> getValidVouchers() {
        List<VoucherResponse> vouchers = voucherService.getValidVouchers().stream()
                .map(voucher -> voucherService.mapVoucherToResponse(voucher))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách voucher có thể sử dụng thành công", vouchers));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiResponse<VoucherResponse>> getVoucherById(@PathVariable Integer id) {
        Voucher voucher = voucherService.getVoucherById(id);
        VoucherResponse response = voucherService.mapVoucherToResponse(voucher);
        
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin voucher thành công", response));
    }
    

    @PostMapping
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiResponse<VoucherResponse>> createVoucher(
            @Valid @RequestBody CreateVoucherRequest request
    ) {
        Voucher voucher = voucherService.createVoucher(request);
        VoucherResponse response = voucherService.mapVoucherToResponse(voucher);
        
        return ResponseEntity.ok(ApiResponse.success("Tạo voucher thành công", response));
    }
    

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiResponse<VoucherResponse>> updateVoucher(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateVoucherRequest request
    ) {
        Voucher voucher = voucherService.updateVoucher(id, request);
        VoucherResponse response = voucherService.mapVoucherToResponse(voucher);
        
        return ResponseEntity.ok(ApiResponse.success("Cập nhật voucher thành công", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiResponse<Void>> deleteVoucher(@PathVariable Integer id) {
        voucherService.deleteVoucher(id);
        
        return ResponseEntity.ok(ApiResponse.success("Xóa voucher thành công"));
    }
    

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiResponse<VoucherResponse>> deactivateVoucher(@PathVariable Integer id) {
        Voucher voucher = voucherService.deactivateVoucher(id);
        VoucherResponse response = voucherService.mapVoucherToResponse(voucher);
        
        return ResponseEntity.ok(ApiResponse.success("Vô hiệu hóa voucher thành công", response));
    }

    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<VoucherValidationResponse>> validateVoucher(
            @Valid @RequestBody ValidateVoucherRequest request
    ) {
        VoucherValidationResponse response = voucherService.validateVoucher(request.getCode());
        
        return ResponseEntity.ok(ApiResponse.success(response.getMessage(), response));
    }
}
