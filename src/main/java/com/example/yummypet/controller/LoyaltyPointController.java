package com.example.yummypet.controller;

import com.example.yummypet.dto.ApiResponse;
import com.example.yummypet.dto.response.LoyaltyPointHistoryDTO;
import com.example.yummypet.dto.response.LoyaltyPointSummaryDTO;
import com.example.yummypet.enums.LoyaltyPointType;
import com.example.yummypet.service.LoyaltyPointService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/loyalty-points")
@RequiredArgsConstructor
public class LoyaltyPointController {

    private final LoyaltyPointService loyaltyPointService;

    public boolean isCurrentCustomer(Authentication authentication, Integer customerId) {
        // Implement logic để kiểm tra customer hiện tại
        // Có thể lấy từ JWT token hoặc UserDetails
        return true; // Tạm thời return true, cần implement chi tiết hơn
    }

    @GetMapping("/customers/{customerId}/history")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or (hasRole('CUSTOMER') and @loyaltyPointController.isCurrentCustomer(authentication, #customerId))")
    public ResponseEntity<ApiResponse<Page<LoyaltyPointHistoryDTO>>> getCustomerLoyaltyHistory(
            @PathVariable Integer customerId,
            Pageable pageable) {
        try {
            Page<LoyaltyPointHistoryDTO> history = loyaltyPointService.getCustomerLoyaltyHistory(customerId, pageable);
            return ResponseEntity.ok(
                    ApiResponse.<Page<LoyaltyPointHistoryDTO>>builder()
                            .success(true)
                            .message("Lấy lịch sử tích điểm thành công")
                            .data(history)
                            .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<Page<LoyaltyPointHistoryDTO>>builder()
                            .success(false)
                            .message("Không tìm thấy khách hàng: " + e.getMessage())
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<Page<LoyaltyPointHistoryDTO>>builder()
                            .success(false)
                            .message("Lỗi khi lấy lịch sử tích điểm: " + e.getMessage())
                            .build());
        }
    }

    @GetMapping("/customers/{customerId}/history/type/{type}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or (hasRole('CUSTOMER') and @loyaltyPointController.isCurrentCustomer(authentication, #customerId))")
    public ResponseEntity<ApiResponse<Page<LoyaltyPointHistoryDTO>>> getCustomerLoyaltyHistoryByType(
            @PathVariable Integer customerId,
            @PathVariable LoyaltyPointType type,
            Pageable pageable) {
        try {
            Page<LoyaltyPointHistoryDTO> history = loyaltyPointService.getCustomerLoyaltyHistoryByType(customerId, type,
                    pageable);
            return ResponseEntity.ok(
                    ApiResponse.<Page<LoyaltyPointHistoryDTO>>builder()
                            .success(true)
                            .message("Lấy lịch sử tích điểm theo loại thành công")
                            .data(history)
                            .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<Page<LoyaltyPointHistoryDTO>>builder()
                            .success(false)
                            .message("Không tìm thấy khách hàng: " + e.getMessage())
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<Page<LoyaltyPointHistoryDTO>>builder()
                            .success(false)
                            .message("Lỗi khi lấy lịch sử tích điểm: " + e.getMessage())
                            .build());
        }
    }

    @GetMapping("/customers/{customerId}/history/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or (hasRole('CUSTOMER') and @loyaltyPointController.isCurrentCustomer(authentication, #customerId))")
    public ResponseEntity<ApiResponse<Page<LoyaltyPointHistoryDTO>>> getCustomerLoyaltyHistoryByDateRange(
            @PathVariable Integer customerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable) {
        try {
            if (startDate.isAfter(endDate)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.<Page<LoyaltyPointHistoryDTO>>builder()
                                .success(false)
                                .message("Ngày bắt đầu không thể sau ngày kết thúc")
                                .build());
            }

            Page<LoyaltyPointHistoryDTO> history = loyaltyPointService.getCustomerLoyaltyHistoryByDateRange(
                    customerId, startDate, endDate, pageable);
            return ResponseEntity.ok(
                    ApiResponse.<Page<LoyaltyPointHistoryDTO>>builder()
                            .success(true)
                            .message("Lấy lịch sử tích điểm theo thời gian thành công")
                            .data(history)
                            .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<Page<LoyaltyPointHistoryDTO>>builder()
                            .success(false)
                            .message("Không tìm thấy khách hàng: " + e.getMessage())
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<Page<LoyaltyPointHistoryDTO>>builder()
                            .success(false)
                            .message("Lỗi khi lấy lịch sử tích điểm: " + e.getMessage())
                            .build());
        }
    }

    @GetMapping("/customers/{customerId}/summary")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or (hasRole('CUSTOMER') and @loyaltyPointController.isCurrentCustomer(authentication, #customerId))")
    public ResponseEntity<ApiResponse<LoyaltyPointSummaryDTO>> getCustomerLoyaltyPointSummary(
            @PathVariable Integer customerId) {
        try {
            LoyaltyPointSummaryDTO summary = loyaltyPointService.getCustomerLoyaltyPointSummary(customerId);
            return ResponseEntity.ok(
                    ApiResponse.<LoyaltyPointSummaryDTO>builder()
                            .success(true)
                            .message("Lấy tóm tắt điểm tích lũy thành công")
                            .data(summary)
                            .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<LoyaltyPointSummaryDTO>builder()
                            .success(false)
                            .message("Không tìm thấy khách hàng: " + e.getMessage())
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<LoyaltyPointSummaryDTO>builder()
                            .success(false)
                            .message("Lỗi khi lấy tóm tắt điểm tích lũy: " + e.getMessage())
                            .build());
        }
    }

    @GetMapping("/customers/{customerId}/recent")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or (hasRole('CUSTOMER') and @loyaltyPointController.isCurrentCustomer(authentication, #customerId))")
    public ResponseEntity<ApiResponse<List<LoyaltyPointHistoryDTO>>> getRecentLoyaltyHistory(
            @PathVariable Integer customerId) {
        try {
            List<LoyaltyPointHistoryDTO> recentHistory = loyaltyPointService.getRecentLoyaltyHistory(customerId);
            return ResponseEntity.ok(
                    ApiResponse.<List<LoyaltyPointHistoryDTO>>builder()
                            .success(true)
                            .message("Lấy giao dịch điểm gần nhất thành công")
                            .data(recentHistory)
                            .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<List<LoyaltyPointHistoryDTO>>builder()
                            .success(false)
                            .message("Không tìm thấy khách hàng: " + e.getMessage())
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<List<LoyaltyPointHistoryDTO>>builder()
                            .success(false)
                            .message("Lỗi khi lấy giao dịch điểm gần nhất: " + e.getMessage())
                            .build());
        }
    }

    @GetMapping("/types")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<LoyaltyPointType[]>> getLoyaltyPointTypes() {
        try {
            return ResponseEntity.ok(
                    ApiResponse.<LoyaltyPointType[]>builder()
                            .success(true)
                            .message("Lấy danh sách loại điểm tích lũy thành công")
                            .data(LoyaltyPointType.values())
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<LoyaltyPointType[]>builder()
                            .success(false)
                            .message("Lỗi khi lấy danh sách loại điểm: " + e.getMessage())
                            .build());
        }
    }
}
