package com.example.yummypet.service;

import com.example.yummypet.dto.response.*;
import com.example.yummypet.entity.*;
import com.example.yummypet.enums.ItemType;
import com.example.yummypet.enums.OrderStatus;
import com.example.yummypet.enums.ServiceStatus;
import com.example.yummypet.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StatisticsService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final ServiceRepository serviceRepository;
    private final EmployeeRepository employeeRepository;
    private final LoyaltyPointHistoryRepository loyaltyPointHistoryRepository;

    @Autowired
    public StatisticsService(OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CustomerRepository customerRepository,
            ProductRepository productRepository,
            ServiceRepository serviceRepository,
            EmployeeRepository employeeRepository,
            LoyaltyPointHistoryRepository loyaltyPointHistoryRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.serviceRepository = serviceRepository;
        this.employeeRepository = employeeRepository;
        this.loyaltyPointHistoryRepository = loyaltyPointHistoryRepository;
    }


    public DashboardStatisticsDTO getDashboardStatistics() {
        LocalDateTime today = LocalDate.now().atStartOfDay();
        LocalDateTime tomorrow = today.plusDays(1);
        LocalDateTime monthStart = YearMonth.now().atDay(1).atStartOfDay();
        LocalDateTime monthEnd = YearMonth.now().atEndOfMonth().plusDays(1).atStartOfDay();

        SalesStatisticsDTO salesStatistics = getSalesStatisticsInternal(monthStart, tomorrow);

        CustomerStatisticsDTO customerStatistics = getCustomerStatisticsInternal();

        BigDecimal todayRevenue = orderRepository.sumTotalAmountByCreatedAtBetween(today, tomorrow);
        Long todayOrders = orderRepository.countByCreatedAtBetween(today, tomorrow);
        Long todayNewCustomers = customerRepository.countNewCustomersBetween(today, tomorrow);

        ProductStatisticsDTO topSellingProduct = getTopSellingProduct();

        ServiceStatisticsDTO mostBookedService = getMostBookedService();

        Long totalProducts = productRepository.count();
        Long totalServices = serviceRepository.count();
        Long totalEmployees = employeeRepository.count();

        return DashboardStatisticsDTO.builder()
                .salesStatistics(salesStatistics)
                .customerStatistics(customerStatistics)
                .todayRevenue(todayRevenue)
                .todayOrders(todayOrders)
                .todayNewCustomers(todayNewCustomers)
                .topSellingProduct(topSellingProduct)
                .mostBookedService(mostBookedService)
                .totalProducts(totalProducts)
                .totalServices(totalServices)
                .totalEmployees(totalEmployees)
                .build();
    }

    public SalesStatisticsDTO getSalesStatistics(LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Ngày bắt đầu không thể sau ngày kết thúc");
        }

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay(); // Để bao gồm cả endDate

        return getSalesStatisticsInternal(startDateTime, endDateTime);
    }

    private SalesStatisticsDTO getSalesStatisticsInternal(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        BigDecimal totalRevenue = orderRepository.sumTotalAmountByCreatedAtBetween(startDateTime, endDateTime);
        Long totalOrders = orderRepository.countByCreatedAtBetween(startDateTime, endDateTime);

        LocalDateTime monthStart = YearMonth.now().atDay(1).atStartOfDay();
        LocalDateTime monthEnd = YearMonth.now().atEndOfMonth().plusDays(1).atStartOfDay();
        BigDecimal monthlyRevenue = orderRepository.sumTotalAmountByCreatedAtBetween(monthStart, monthEnd);
        Long monthlyOrders = orderRepository.countByCreatedAtBetween(monthStart, monthEnd);

        LocalDateTime today = LocalDate.now().atStartOfDay();
        LocalDateTime tomorrow = today.plusDays(1);
        BigDecimal dailyRevenue = orderRepository.sumTotalAmountByCreatedAtBetween(today, tomorrow);
        Long dailyOrders = orderRepository.countByCreatedAtBetween(today, tomorrow);

        BigDecimal averageOrderValue = BigDecimal.ZERO;
        if (totalOrders > 0) {
            averageOrderValue = totalRevenue.divide(new BigDecimal(totalOrders), 2, RoundingMode.HALF_UP);
        }

        BigDecimal growthRate = calculateGrowthRate();

        return SalesStatisticsDTO.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .monthlyRevenue(monthlyRevenue)
                .monthlyOrders(monthlyOrders)
                .dailyRevenue(dailyRevenue)
                .dailyOrders(dailyOrders)
                .averageOrderValue(averageOrderValue)
                .growthRate(growthRate)
                .build();
    }

    private BigDecimal calculateGrowthRate() {
        YearMonth currentMonth = YearMonth.now();
        LocalDateTime currentMonthStart = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime currentMonthEnd = currentMonth.atEndOfMonth().plusDays(1).atStartOfDay();
        BigDecimal currentMonthRevenue = orderRepository.sumTotalAmountByCreatedAtBetween(currentMonthStart,
                currentMonthEnd);

        YearMonth previousMonth = currentMonth.minusMonths(1);
        LocalDateTime previousMonthStart = previousMonth.atDay(1).atStartOfDay();
        LocalDateTime previousMonthEnd = previousMonth.atEndOfMonth().plusDays(1).atStartOfDay();
        BigDecimal previousMonthRevenue = orderRepository.sumTotalAmountByCreatedAtBetween(previousMonthStart,
                previousMonthEnd);

        if (previousMonthRevenue.compareTo(BigDecimal.ZERO) > 0) {
            return currentMonthRevenue.subtract(previousMonthRevenue)
                    .multiply(new BigDecimal(100))
                    .divide(previousMonthRevenue, 2, RoundingMode.HALF_UP);
        }

        return BigDecimal.ZERO;
    }

    public CustomerStatisticsDTO getCustomerStatistics() {
        return getCustomerStatisticsInternal();
    }

    private CustomerStatisticsDTO getCustomerStatisticsInternal() {
        Long totalCustomers = customerRepository.count();

        LocalDateTime monthStart = YearMonth.now().atDay(1).atStartOfDay();
        LocalDateTime monthEnd = YearMonth.now().atEndOfMonth().plusDays(1).atStartOfDay();
        Long newCustomersThisMonth = customerRepository.countNewCustomersBetween(monthStart, monthEnd);

        LocalDateTime thirtyDaysAgo = LocalDate.now().minusDays(30).atStartOfDay();
        Long activeCustomers = customerRepository.countActiveCustomersSince(thirtyDaysAgo);

        Long loyalCustomers = customerRepository.countLoyalCustomers();

        Integer averageLoyaltyPoints = customerRepository.getAverageLoyaltyPoints();


        return CustomerStatisticsDTO.builder()
                .totalCustomers(totalCustomers)
                .newCustomersThisMonth(newCustomersThisMonth)
                .activeCustomers(activeCustomers)
                .loyalCustomers(loyalCustomers)
                .averageLoyaltyPoints(averageLoyaltyPoints)
                .totalLoyaltyPointsIssued(0L)
                .totalLoyaltyPointsRedeemed(0L)
                .build();
    }


    public List<ProductStatisticsDTO> getTopSellingProducts(int limit) {
        LocalDateTime threeMonthsAgo = LocalDate.now().minusMonths(3).atStartOfDay();

        List<Object[]> topSellingProducts = orderItemRepository.findTopSellingProducts(threeMonthsAgo,
                PageRequest.of(0, limit));

        return topSellingProducts.stream()
                .map(this::mapToProductStatistics)
                .collect(Collectors.toList());
    }


    private ProductStatisticsDTO mapToProductStatistics(Object[] row) {
        Integer productId = (Integer) row[0];
        String productName = (String) row[1];
        String categoryName = (String) row[2];
        Long totalSold = ((Number) row[3]).longValue();
        BigDecimal revenue = (BigDecimal) row[4];

        Product product = productRepository.findById(productId).orElse(null);
        Integer stockQuantity = product != null ? product.getStockQuantity() : 0;

        BigDecimal profit = revenue.multiply(new BigDecimal("0.2"));

        return ProductStatisticsDTO.builder()
                .productId(productId)
                .productName(productName)
                .categoryName(categoryName)
                .totalSold(totalSold)
                .stockQuantity(stockQuantity)
                .revenue(revenue)
                .profit(profit)
                .build();
    }

 
    private ProductStatisticsDTO getTopSellingProduct() {
        List<ProductStatisticsDTO> topProducts = getTopSellingProducts(1);
        return !topProducts.isEmpty() ? topProducts.get(0) : null;
    }


    public ProductStatisticsDTO getInventoryStatistics() {
        Long totalProducts = productRepository.count();

        Long lowStockCount = (long) productRepository.findProductsBelowMinStock().size();

        return ProductStatisticsDTO.builder()
                .totalProducts(totalProducts.intValue())
                .lowStockCount(lowStockCount)
                .build();
    }


    public List<ServiceStatisticsDTO> getServiceStatistics() {
        LocalDateTime threeMonthsAgo = LocalDate.now().minusMonths(3).atStartOfDay();
        List<Object[]> serviceStats = orderItemRepository.findServiceBookingStats(threeMonthsAgo);

        Long totalServices = serviceRepository.count();

        return serviceStats.stream()
                .map(row -> mapToServiceStatistics(row, totalServices.intValue()))
                .collect(Collectors.toList());
    }

    private ServiceStatisticsDTO mapToServiceStatistics(Object[] row, Integer totalServices) {
        Integer serviceId = (Integer) row[0];
        String serviceName = (String) row[1];
        Long totalBookings = ((Number) row[2]).longValue();
        Long completedBookings = ((Number) row[3]).longValue();
        Long cancelledBookings = ((Number) row[4]).longValue();

        Double completionRate = 0.0;
        if (totalBookings > 0) {
            completionRate = (completedBookings.doubleValue() / totalBookings.doubleValue()) * 100;
        }

        return ServiceStatisticsDTO.builder()
                .serviceId(serviceId)
                .serviceName(serviceName)
                .totalBookings(totalBookings)
                .completedBookings(completedBookings)
                .cancelledBookings(cancelledBookings)
                .completionRate(completionRate)
                .totalServices(totalServices)
                .build();
    }

    /**
     * Lấy dịch vụ được đặt nhiều nhất
     */
    private ServiceStatisticsDTO getMostBookedService() {
        Long totalServices = serviceRepository.count();
        List<ServiceStatisticsDTO> services = getServiceStatistics();
        return services.stream()
                .max(Comparator.comparing(ServiceStatisticsDTO::getTotalBookings))
                .orElse(ServiceStatisticsDTO.builder()
                        .totalServices(totalServices.intValue())
                        .build());
    }

    /**
     * Lấy thống kê doanh thu hàng tháng
     */
    public List<MonthlySalesDTO> getMonthlySalesStatistics(int year) {
        List<Object[]> monthlySalesData = orderRepository.getMonthlySalesStatisticsRaw(year);

        List<MonthlySalesDTO> result = new ArrayList<>();
        for (Object[] row : monthlySalesData) {
            MonthlySalesDTO dto = MonthlySalesDTO.builder()
                    .month(((Number) row[0]).intValue())
                    .monthName((String) row[1])
                    .year(((Number) row[2]).intValue())
                    .totalOrders(((Number) row[3]).longValue())
                    .totalRevenue((BigDecimal) row[4])
                    .averageOrderValue((BigDecimal) row[5])
                    .build();
            result.add(dto);
        }

        return result;
    }

    /**
     * Lấy thống kê tăng trưởng
     */
    public GrowthStatisticsDTO getGrowthStatistics() {
        YearMonth currentMonth = YearMonth.now();
        LocalDateTime currentMonthStart = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime currentMonthEnd = currentMonth.atEndOfMonth().plusDays(1).atStartOfDay();

        BigDecimal currentMonthRevenue = orderRepository.sumTotalAmountByCreatedAtBetween(currentMonthStart,
                currentMonthEnd);
        Long currentMonthOrders = orderRepository.countByCreatedAtBetween(currentMonthStart, currentMonthEnd);
        Long currentMonthCustomers = customerRepository.countNewCustomersBetween(currentMonthStart, currentMonthEnd);

        YearMonth previousMonth = currentMonth.minusMonths(1);
        LocalDateTime previousMonthStart = previousMonth.atDay(1).atStartOfDay();
        LocalDateTime previousMonthEnd = previousMonth.atEndOfMonth().plusDays(1).atStartOfDay();

        BigDecimal previousMonthRevenue = orderRepository.sumTotalAmountByCreatedAtBetween(previousMonthStart,
                previousMonthEnd);
        Long previousMonthOrders = orderRepository.countByCreatedAtBetween(previousMonthStart, previousMonthEnd);
        Long previousMonthCustomers = customerRepository.countNewCustomersBetween(previousMonthStart, previousMonthEnd);

        BigDecimal revenueGrowthAmount = currentMonthRevenue.subtract(previousMonthRevenue);
        BigDecimal revenueGrowthPercentage = BigDecimal.ZERO;
        if (previousMonthRevenue.compareTo(BigDecimal.ZERO) > 0) {
            revenueGrowthPercentage = revenueGrowthAmount.multiply(new BigDecimal(100))
                    .divide(previousMonthRevenue, 2, RoundingMode.HALF_UP);
        }

        Long orderGrowthAmount = currentMonthOrders - previousMonthOrders;
        Double orderGrowthPercentage = 0.0;
        if (previousMonthOrders > 0) {
            orderGrowthPercentage = (orderGrowthAmount.doubleValue() / previousMonthOrders.doubleValue()) * 100;
        }

        Long customerGrowthAmount = currentMonthCustomers - previousMonthCustomers;
        Double customerGrowthPercentage = 0.0;
        if (previousMonthCustomers > 0) {
            customerGrowthPercentage = (customerGrowthAmount.doubleValue() / previousMonthCustomers.doubleValue())
                    * 100;
        }

        return GrowthStatisticsDTO.builder()
                .revenueGrowthAmount(revenueGrowthAmount)
                .revenueGrowthPercentage(revenueGrowthPercentage)
                .orderGrowthAmount(orderGrowthAmount)
                .orderGrowthPercentage(orderGrowthPercentage)
                .customerGrowthAmount(customerGrowthAmount)
                .customerGrowthPercentage(customerGrowthPercentage)
                .currentMonthRevenue(currentMonthRevenue)
                .previousMonthRevenue(previousMonthRevenue)
                .currentMonthOrders(currentMonthOrders)
                .previousMonthOrders(previousMonthOrders)
                .currentMonthCustomers(currentMonthCustomers)
                .previousMonthCustomers(previousMonthCustomers)
                .build();
    }
}
