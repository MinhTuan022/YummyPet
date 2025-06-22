package com.example.yummypet.controller;

import com.example.yummypet.dto.ApiResponse;
import com.example.yummypet.dto.request.CreateCustomerRequest;
import com.example.yummypet.dto.request.UpdateCustomerRequest;
import com.example.yummypet.dto.request.UpdateLoyaltyPointsRequest;
import com.example.yummypet.dto.response.CustomerResponse;
import com.example.yummypet.dto.response.LoyaltyPointsResponse;
import com.example.yummypet.entity.Customer;
import com.example.yummypet.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('customer')")
    public ResponseEntity<ApiResponse<CustomerResponse>> getCurrentCustomer(Authentication authentication) {
        Customer customer = customerService.getCustomerByUsername(authentication.getName());
        CustomerResponse response = mapToCustomerResponse(customer);

        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin khách hàng thành công", response));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiResponse<Page<CustomerResponse>>> getAllCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = Sort.by(sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<CustomerResponse> customerResponses = customerService.getAllCustomers(pageable)
                .map(this::mapToCustomerResponse);

        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách khách hàng thành công", customerResponses));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyAuthority('admin', 'staff')")
    public ResponseEntity<ApiResponse<Page<CustomerResponse>>> searchCustomers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = Sort.by(sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<CustomerResponse> customerResponses = customerService.searchCustomers(keyword, pageable)
                .map(this::mapToCustomerResponse);

        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm khách hàng thành công", customerResponses));
    }

    @GetMapping("/search/phone")
    @PreAuthorize("hasAnyAuthority('admin', 'staff')")
    public ResponseEntity<ApiResponse<Page<CustomerResponse>>> searchCustomersByPhone(
            @RequestParam String phone,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = Sort.by(sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<CustomerResponse> customerResponses = customerService.searchCustomersByPhonePartial(phone, pageable)
                .map(this::mapToCustomerResponse);

        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm khách hàng theo số điện thoại thành công", customerResponses));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'staff')")
    public ResponseEntity<ApiResponse<CustomerResponse>> getCustomerById(@PathVariable Integer id) {
        Customer customer = customerService.getCustomerById(id);
        CustomerResponse response = mapToCustomerResponse(customer);

        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin khách hàng thành công", response));
    }

    @GetMapping("/code/{code}")
    @PreAuthorize("hasAnyAuthority('admin', 'staff')")
    public ResponseEntity<ApiResponse<CustomerResponse>> getCustomerByCode(@PathVariable String code) {
        Customer customer = customerService.getCustomerByCode(code);
        CustomerResponse response = mapToCustomerResponse(customer);

        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin khách hàng thành công", response));
    }

    @GetMapping("/phone/{phone}")
    @PreAuthorize("hasAnyAuthority('admin', 'staff')")
    public ResponseEntity<ApiResponse<CustomerResponse>> getCustomerByPhone(@PathVariable String phone) {
        Customer customer = customerService.getCustomerByPhone(phone);
        CustomerResponse response = mapToCustomerResponse(customer);

        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin khách hàng theo số điện thoại thành công", response));
    }

    @GetMapping("/top")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiResponse<List<CustomerResponse>>> getTopCustomers(
            @RequestParam(defaultValue = "100") Integer minPoints,
            @RequestParam(defaultValue = "10") Integer limit) {
        List<CustomerResponse> topCustomers = customerService.getTopCustomersByLoyaltyPoints(minPoints, limit)
                .stream()
                .map(this::mapToCustomerResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách khách hàng VIP thành công", topCustomers));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('admin', 'staff')")
    public ResponseEntity<ApiResponse<CustomerResponse>> createCustomer(
            @Valid @RequestBody CreateCustomerRequest request) {
        Customer customer = new Customer();
        customer.setFullName(request.getFullName());
        customer.setPhone(request.getPhone());
        customer.setEmail(request.getEmail());
        customer.setAddress(request.getAddress());
        customer.setDateOfBirth(request.getDateOfBirth());
        customer.setGender(request.getGender());
        customer.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));

        Customer createdCustomer = customerService.createCustomer(customer);
        CustomerResponse response = mapToCustomerResponse(createdCustomer);

        return ResponseEntity.ok(ApiResponse.success("Tạo khách hàng thành công", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'staff', 'customer')")
    public ResponseEntity<ApiResponse<CustomerResponse>> updateCustomer(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateCustomerRequest request,
            Authentication authentication) {
        Customer customerDetails = new Customer();
        customerDetails.setFullName(request.getFullName());
        customerDetails.setPhone(request.getPhone());
        customerDetails.setEmail(request.getEmail());
        customerDetails.setAddress(request.getAddress());
        customerDetails.setDateOfBirth(request.getDateOfBirth());
        customerDetails.setGender(request.getGender());

        Customer updatedCustomer = customerService.updateCustomer(id, customerDetails, authentication.getName());
        CustomerResponse response = mapToCustomerResponse(updatedCustomer);

        return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin khách hàng thành công", response));
    }

    @PatchMapping("/{id}/loyalty-points")
    @PreAuthorize("hasAnyAuthority('admin', 'staff')")
    public ResponseEntity<ApiResponse<LoyaltyPointsResponse>> updateLoyaltyPoints(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateLoyaltyPointsRequest request) {
        Customer customer = customerService.getCustomerById(id);
        Integer previousPoints = customer.getLoyaltyPoints();

        Customer updatedCustomer = customerService.updateLoyaltyPoints(id, request.getPoints());

        LoyaltyPointsResponse response = LoyaltyPointsResponse.builder()
                .customerId(updatedCustomer.getId())
                .customerCode(updatedCustomer.getCustomerCode())
                .fullName(updatedCustomer.getFullName())
                .previousPoints(previousPoints)
                .currentPoints(updatedCustomer.getLoyaltyPoints())
                .change(request.getPoints())
                .build();

        return ResponseEntity.ok(ApiResponse.success("Cập nhật điểm thưởng thành công", response));
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiResponse<CustomerResponse>> deactivateCustomer(@PathVariable Integer id) {
        Customer customer = customerService.deactivateCustomer(id);
        CustomerResponse response = mapToCustomerResponse(customer);

        return ResponseEntity.ok(ApiResponse.success("Vô hiệu hóa tài khoản khách hàng thành công", response));
    }

    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiResponse<CustomerResponse>> activateCustomer(@PathVariable Integer id) {
        Customer customer = customerService.activateCustomer(id);
        CustomerResponse response = mapToCustomerResponse(customer);

        return ResponseEntity.ok(ApiResponse.success("Kích hoạt tài khoản khách hàng thành công", response));
    }

    private CustomerResponse mapToCustomerResponse(Customer customer) {
        return CustomerResponse.builder()
                .id(customer.getId())
                .customerCode(customer.getCustomerCode())
                .fullName(customer.getFullName())
                .phone(customer.getPhone())
                .email(customer.getEmail())
                .address(customer.getAddress())
                .dateOfBirth(customer.getDateOfBirth())
                .gender(customer.getGender())
                .loyaltyPoints(customer.getLoyaltyPoints())
                .isActive(customer.getIsActive())
                .createdAt(customer.getCreatedAt() != null ? customer.getCreatedAt().toLocalDateTime() : null)
                .updatedAt(customer.getUpdatedAt() != null ? customer.getUpdatedAt().toLocalDateTime() : null)
                .hasAccount(customer.getUser() != null)
                .build();
    }
}
