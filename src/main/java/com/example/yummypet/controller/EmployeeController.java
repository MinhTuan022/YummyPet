package com.example.yummypet.controller;

import com.example.yummypet.dto.common.ApiResponse;
import com.example.yummypet.dto.request.category.CategoryRequestDTO;
import com.example.yummypet.dto.request.employee.EmployeeUpdateRequestDTO;
import com.example.yummypet.dto.response.category.CategoryResponseDTO;
import com.example.yummypet.dto.response.employee.EmployeeResponseDTO;
import com.example.yummypet.service.EmployeeService;
import com.example.yummypet.service.category.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@Validated
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeResponseDTO>>> getAllEmployees() {
        try {
            List<EmployeeResponseDTO> employees = employeeService.getAllEmployees();
            return ResponseEntity.ok(
                    ApiResponse.success("Lấy danh sách nhân viên thành công", employees)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi lấy danh sách nhân viên: " + e.getMessage()));
        }
    }

    @GetMapping("/pagination")
    public ResponseEntity<ApiResponse<Page<EmployeeResponseDTO>>> getAllEmployeesWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        try {
            Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ?
                    Sort.Direction.DESC : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

            Page<EmployeeResponseDTO> employees = employeeService.getAllEmployeesWithPagination(pageable);
            return ResponseEntity.ok(
                    ApiResponse.success("Lấy danh sách nhân viên thành công", employees)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi lấy danh sách nhân viên: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponseDTO>> getEmployeeById(@PathVariable Integer id) {
        try {
            return employeeService.getEmployeeById(id)
                    .map(employee -> ResponseEntity.ok(
                            ApiResponse.success("Lấy thông tin nhân viên thành công", employee)))
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(ApiResponse.error("Không tìm thấy nhân viên với ID: " + id)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi lấy thông tin nhân viên: " + e.getMessage()));
        }
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<ApiResponse<EmployeeResponseDTO>> getEmployeeByUsername(@PathVariable String username) {
        try {
            return employeeService.getEmployeeByUsername(username)
                    .map(employee -> ResponseEntity.ok(
                            ApiResponse.success("Lấy thông tin nhân viên thành công", employee)))
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(ApiResponse.error("Không tìm thấy nhân viên với username: " + username)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi lấy thông tin nhân viên: " + e.getMessage()));
        }
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<EmployeeResponseDTO>>> getActiveEmployees() {
        try {
            List<EmployeeResponseDTO> employees = employeeService.getActiveEmployees();
            return ResponseEntity.ok(
                    ApiResponse.success("Lấy danh sách nhân viên đang hoạt động thành công", employees)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi lấy danh sách nhân viên: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<EmployeeResponseDTO>>> searchEmployees(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        try {
            Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ?
                    Sort.Direction.DESC : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

            Page<EmployeeResponseDTO> employees = employeeService.searchEmployees(keyword, pageable);
            return ResponseEntity.ok(
                    ApiResponse.success("Tìm kiếm nhân viên thành công", employees)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi tìm kiếm nhân viên: " + e.getMessage()));
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponseDTO>> updateEmployee(
            @PathVariable Integer id,
            @Valid @RequestBody EmployeeUpdateRequestDTO requestDTO) {
        try {
            EmployeeResponseDTO updatedEmployee = employeeService.updateEmployee(id, requestDTO);
            return ResponseEntity.ok(
                    ApiResponse.success("Cập nhật nhân viên thành công", updatedEmployee)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi cập nhật thông tin nhân viên: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Integer id) {
        try {
            employeeService.deleteEmployee(id);
            return ResponseEntity.ok(
                    ApiResponse.success("Xóa nhân viên thành công (soft delete)", null)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi xóa nhân viên: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/hard")
    public ResponseEntity<ApiResponse<Void>> hardDeleteEmployee(@PathVariable Integer id) {
        try {
            employeeService.hardDeleteEmployee(id);
            return ResponseEntity.ok(
                    ApiResponse.success("Xóa vĩnh viễn nhân viên thành công", null)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi xóa vĩnh viễn nhân viên: " + e.getMessage()));
        }
    }
}