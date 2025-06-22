package com.example.yummypet.controller;

import com.example.yummypet.dto.ApiResponse;
import com.example.yummypet.dto.request.EmployeeRequest;
import com.example.yummypet.dto.request.UpdateEmployeeRequest;
import com.example.yummypet.dto.response.EmployeeDTO;
import com.example.yummypet.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiResponse<Page<EmployeeDTO>>> getAllEmployees(Pageable pageable) {
        try {
            Page<EmployeeDTO> employees = employeeService.getAllEmployees(pageable);
            return ResponseEntity.ok(
                    ApiResponse.<Page<EmployeeDTO>>builder()
                            .success(true)
                            .message("Lấy danh sách nhân viên thành công")
                            .data(employees)
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<Page<EmployeeDTO>>builder()
                            .success(false)
                            .message("Lỗi khi lấy danh sách nhân viên: " + e.getMessage())
                            .build());
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('staff')")
    public ResponseEntity<ApiResponse<EmployeeDTO>> getEmployeeById(@PathVariable Integer id) {
        try {
            return employeeService.getEmployeeById(id)
                    .map(employee -> ResponseEntity.ok(
                            ApiResponse.<EmployeeDTO>builder()
                                    .success(true)
                                    .message("Lấy thông tin nhân viên thành công")
                                    .data(employee)
                                    .build()))
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(ApiResponse.<EmployeeDTO>builder()
                                    .success(false)
                                    .message("Không tìm thấy nhân viên với ID: " + id)
                                    .build()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<EmployeeDTO>builder()
                            .success(false)
                            .message("Lỗi khi lấy thông tin nhân viên: " + e.getMessage())
                            .build());
        }
    }

    @GetMapping("/code/{employeeCode}")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('staff')")
    public ResponseEntity<ApiResponse<EmployeeDTO>> getEmployeeByCode(@PathVariable String employeeCode) {
        try {
            return employeeService.getEmployeeByCode(employeeCode)
                    .map(employee -> ResponseEntity.ok(
                            ApiResponse.<EmployeeDTO>builder()
                                    .success(true)
                                    .message("Lấy thông tin nhân viên thành công")
                                    .data(employee)
                                    .build()))
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(ApiResponse.<EmployeeDTO>builder()
                                    .success(false)
                                    .message("Không tìm thấy nhân viên với mã: " + employeeCode)
                                    .build()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<EmployeeDTO>builder()
                            .success(false)
                            .message("Lỗi khi lấy thông tin nhân viên: " + e.getMessage())
                            .build());
        }
    }

    @PostMapping
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiResponse<EmployeeDTO>> createEmployee(@RequestBody EmployeeRequest request) {
        try {
            EmployeeDTO newEmployee = employeeService.createEmployee(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.<EmployeeDTO>builder()
                            .success(true)
                            .message("Tạo nhân viên mới thành công")
                            .data(newEmployee)
                            .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.<EmployeeDTO>builder()
                            .success(false)
                            .message("Dữ liệu không hợp lệ: " + e.getMessage())
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<EmployeeDTO>builder()
                            .success(false)
                            .message("Lỗi khi tạo nhân viên: " + e.getMessage())
                            .build());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiResponse<EmployeeDTO>> updateEmployee(
            @PathVariable Integer id,
            @RequestBody UpdateEmployeeRequest request) {
        try {
            EmployeeDTO updatedEmployee = employeeService.updateEmployee(id, request);
            return ResponseEntity.ok(
                    ApiResponse.<EmployeeDTO>builder()
                            .success(true)
                            .message("Cập nhật thông tin nhân viên thành công")
                            .data(updatedEmployee)
                            .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.<EmployeeDTO>builder()
                            .success(false)
                            .message("Dữ liệu không hợp lệ: " + e.getMessage())
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<EmployeeDTO>builder()
                            .success(false)
                            .message("Lỗi khi cập nhật nhân viên: " + e.getMessage())
                            .build());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Integer id) {
        try {
            employeeService.deleteEmployee(id);
            return ResponseEntity.ok(
                    ApiResponse.<Void>builder()
                            .success(true)
                            .message("Xóa nhân viên thành công")
                            .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<Void>builder()
                            .success(false)
                            .message("Không tìm thấy nhân viên: " + e.getMessage())
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<Void>builder()
                            .success(false)
                            .message("Lỗi khi xóa nhân viên: " + e.getMessage())
                            .build());
        }
    }
}
