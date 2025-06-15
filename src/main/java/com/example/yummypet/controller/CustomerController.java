package com.example.yummypet.controller;

import com.example.yummypet.dto.common.ApiResponse;
import com.example.yummypet.dto.response.customer.CustomerDTO;
import com.example.yummypet.dto.response.customer.CustomerDetailDTO;
import com.example.yummypet.service.CustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@Slf4j
public class CustomerController {

    private final CustomerService customerService;


    @GetMapping
    public ResponseEntity<ApiResponse<List<CustomerDTO>>> getAllCustomers() {
        try {
            List<CustomerDTO> customers = customerService.getAllCustomers();
            return ResponseEntity.ok(
                    ApiResponse.success("Lấy danh sách khách hàng thành công", customers)
            );
        } catch (Exception e) {
            log.error("Error fetching customers: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi lấy danh sách khách hàng: " + e.getMessage()));
        }
    }


    @GetMapping("/paged")
    public ResponseEntity<ApiResponse<Page<CustomerDTO>>> getAllCustomersWithPaging(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {
        try {
            Sort sort = Sort.by(sortDirection.equalsIgnoreCase("desc") ?
                    Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
            Pageable pageable = PageRequest.of(page, size, sort);

            Page<CustomerDTO> customers = customerService.getAllCustomers(pageable);
            return ResponseEntity.ok(
                    ApiResponse.success("Lấy danh sách khách hàng thành công", customers)
            );
        } catch (Exception e) {
            log.error("Error fetching customers with paging: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi lấy danh sách khách hàng: " + e.getMessage()));
        }
    }


    @GetMapping("/details")
    public ResponseEntity<ApiResponse<List<CustomerDetailDTO>>> getAllCustomersWithDetails() {
        try {
            List<CustomerDetailDTO> customers = customerService.getAllCustomersWithDetails();
            return ResponseEntity.ok(
                    ApiResponse.success("Lấy danh sách khách hàng chi tiết thành công", customers)
            );
        } catch (Exception e) {
            log.error("Error fetching customer details: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi lấy thông tin chi tiết khách hàng: " + e.getMessage()));
        }
    }


    @GetMapping("/{id}/details")
    public ResponseEntity<ApiResponse<CustomerDetailDTO>> getCustomerDetails(@PathVariable Integer id) {
        try {
            Optional<CustomerDetailDTO> customer = customerService.getCustomerWithDetails(id);
            if (customer.isPresent()) {
                return ResponseEntity.ok(
                        ApiResponse.success("Lấy thông tin khách hàng thành công", customer.get())
                );
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Không tìm thấy khách hàng với ID: " + id));
            }
        } catch (Exception e) {
            log.error("Error fetching customer details for ID {}: ", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi lấy thông tin khách hàng: " + e.getMessage()));
        }
    }


    @GetMapping("/{id}/details-optimized")
    public ResponseEntity<ApiResponse<CustomerDetailDTO>> getCustomerDetailsOptimized(@PathVariable Integer id) {
        try {
            Optional<CustomerDetailDTO> customer = customerService.getCustomerWithDetailsOptimized(id);
            if (customer.isPresent()) {
                return ResponseEntity.ok(
                        ApiResponse.success("Lấy thông tin khách hàng thành công", customer.get())
                );
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Không tìm thấy khách hàng với ID: " + id));
            }
        } catch (Exception e) {
            log.error("Error fetching customer details (optimized) for ID {}: ", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi lấy thông tin khách hàng: " + e.getMessage()));
        }
    }
    @PutMapping("/{id}/soft-delete")
    public ResponseEntity<ApiResponse<Void>> softDeleteCustomer(@PathVariable Integer id) {
        try {
            boolean deleted = customerService.softDeleteCustomer(id);
            if (deleted) {
                return ResponseEntity.ok(
                        ApiResponse.success("Xóa mềm khách hàng thành công", null)
                );
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Không tìm thấy khách hàng hoặc khách hàng đã bị xóa"));
            }
        } catch (Exception e) {
            log.error("Error soft deleting customer ID {}: ", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi xóa mềm khách hàng: " + e.getMessage()));
        }
    }


    @DeleteMapping("/{id}/hard-delete")
    public ResponseEntity<ApiResponse<Void>> hardDeleteCustomer(@PathVariable Integer id) {
        try {
            boolean deleted = customerService.hardDeleteCustomer(id);
            if (deleted) {
                return ResponseEntity.ok(
                        ApiResponse.success("Xóa cứng khách hàng thành công", null)
                );
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Không tìm thấy khách hàng với ID: " + id));
            }
        } catch (RuntimeException e) {
            log.error("Error hard deleting customer ID {}: ", id, e);
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error("Không thể xóa khách hàng do có ràng buộc dữ liệu"));
        } catch (Exception e) {
            log.error("Error hard deleting customer ID {}: ", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi xóa cứng khách hàng: " + e.getMessage()));
        }
    }


    @PutMapping("/{id}/restore")
    public ResponseEntity<ApiResponse<Void>> restoreCustomer(@PathVariable Integer id) {
        try {
            boolean restored = customerService.restoreCustomer(id);
            if (restored) {
                return ResponseEntity.ok(
                        ApiResponse.success("Khôi phục khách hàng thành công", null)
                );
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Không tìm thấy khách hàng hoặc khách hàng đã được kích hoạt"));
            }
        } catch (Exception e) {
            log.error("Error restoring customer ID {}: ", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi khôi phục khách hàng: " + e.getMessage()));
        }
    }
}