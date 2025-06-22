package com.example.yummypet.controller;

import com.example.yummypet.dto.response.ApiResponse;
import com.example.yummypet.dto.response.CustomerStatisticsDTO;
import com.example.yummypet.dto.response.DashboardStatisticsDTO;
import com.example.yummypet.dto.response.GrowthStatisticsDTO;
import com.example.yummypet.dto.response.MonthlySalesDTO;
import com.example.yummypet.dto.response.ProductStatisticsDTO;
import com.example.yummypet.dto.response.SalesStatisticsDTO;
import com.example.yummypet.dto.response.ServiceStatisticsDTO;
import com.example.yummypet.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    private final StatisticsService statisticsService;

    @Autowired
    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyAuthority('admin', 'staff')")
    public ResponseEntity<ApiResponse<DashboardStatisticsDTO>> getDashboardStatistics() {
        DashboardStatisticsDTO statistics = statisticsService.getDashboardStatistics();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thống kê dashboard thành công", statistics));
    }

    @GetMapping("/sales")
    @PreAuthorize("hasAnyAuthority('admin', 'staff')")
    public ResponseEntity<ApiResponse<SalesStatisticsDTO>> getSalesStatistics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        SalesStatisticsDTO statistics = statisticsService.getSalesStatistics(startDate, endDate);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thống kê doanh thu thành công", statistics));
    }

    @GetMapping("/customers")
    @PreAuthorize("hasAnyAuthority('admin', 'staff')")
    public ResponseEntity<ApiResponse<CustomerStatisticsDTO>> getCustomerStatistics() {
        CustomerStatisticsDTO statistics = statisticsService.getCustomerStatistics();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thống kê khách hàng thành công", statistics));
    }

    @GetMapping("/products/top-selling")
    @PreAuthorize("hasAnyAuthority('admin', 'staff')")
    public ResponseEntity<ApiResponse<List<ProductStatisticsDTO>>> getTopSellingProducts(
            @RequestParam(defaultValue = "10") int limit) {
        if (limit > 100)
            limit = 100; // Giới hạn tối đa 100 sản phẩm
        List<ProductStatisticsDTO> statistics = statisticsService.getTopSellingProducts(limit);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thống kê sản phẩm bán chạy thành công", statistics));
    }

    @GetMapping("/products/inventory")
    @PreAuthorize("hasAnyAuthority('admin', 'staff')")
    public ResponseEntity<ApiResponse<ProductStatisticsDTO>> getInventoryStatistics() {
        ProductStatisticsDTO statistics = statisticsService.getInventoryStatistics();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thống kê tồn kho thành công", statistics));
    }

    @GetMapping("/services")
    @PreAuthorize("hasAnyAuthority('admin', 'staff')")
    public ResponseEntity<ApiResponse<List<ServiceStatisticsDTO>>> getServiceStatistics() {
        List<ServiceStatisticsDTO> statistics = statisticsService.getServiceStatistics();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thống kê dịch vụ thành công", statistics));
    }

    @GetMapping("/sales/monthly")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiResponse<List<MonthlySalesDTO>>> getMonthlySalesStatistics(
            @RequestParam(required = false) Integer year) {
        // Nếu không có tham số năm, lấy năm hiện tại
        if (year == null) {
            year = LocalDate.now().getYear();
        }
        List<MonthlySalesDTO> statistics = statisticsService.getMonthlySalesStatistics(year);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thống kê doanh thu hàng tháng thành công", statistics));
    }

    @GetMapping("/growth")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiResponse<GrowthStatisticsDTO>> getGrowthStatistics() {
        GrowthStatisticsDTO statistics = statisticsService.getGrowthStatistics();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thống kê tăng trưởng thành công", statistics));
    }
}
