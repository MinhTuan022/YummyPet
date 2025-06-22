package com.example.yummypet.service;

import com.example.yummypet.dto.response.LoyaltyPointHistoryDTO;
import com.example.yummypet.dto.response.LoyaltyPointSummaryDTO;
import com.example.yummypet.entity.Customer;
import com.example.yummypet.entity.LoyaltyPointHistory;
import com.example.yummypet.entity.Order;
import com.example.yummypet.enums.LoyaltyPointType;
import com.example.yummypet.repository.CustomerRepository;
import com.example.yummypet.repository.LoyaltyPointHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoyaltyPointService {

    private final CustomerRepository customerRepository;
    private final LoyaltyPointHistoryRepository loyaltyPointHistoryRepository;

    // 1 điểm cho mỗi 10,000 VND
    private static final BigDecimal POINTS_RATE = new BigDecimal("10000");    @Transactional
    public void earnPointsFromOrder(Order order) {
        Customer customer = order.getCustomer();
        if (customer == null) {
            throw new IllegalArgumentException("Customer not found in order");
        }

        // Tính điểm tích lũy (1 điểm cho mỗi 10,000 VND)
        int pointsEarned = order.getTotalAmount().divide(POINTS_RATE).intValue();

        if (pointsEarned > 0) {
            int newBalance = customer.getLoyaltyPoints() + pointsEarned;
            customer.setLoyaltyPoints(newBalance);
            customerRepository.save(customer);

            LoyaltyPointHistory history = new LoyaltyPointHistory();
            history.setCustomer(customer);
            history.setPoints(pointsEarned);
            history.setType(LoyaltyPointType.earned);
            history.setOrder(order);
            history.setDescription("Tích điểm từ đơn hàng " + order.getOrderCode());
            history.setCreatedAt(new Timestamp(System.currentTimeMillis()));

            loyaltyPointHistoryRepository.save(history);

            log.info("Customer {} earned {} points from order {}",
                    customer.getCustomerCode(), pointsEarned, order.getOrderCode());
        }
    }    @Transactional
    public void redeemPoints(Integer customerId, int pointsToRedeem, String description) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        if (customer.getLoyaltyPoints() < pointsToRedeem) {
            throw new IllegalArgumentException("Insufficient loyalty points");
        }

        // Trừ điểm
        int newBalance = customer.getLoyaltyPoints() - pointsToRedeem;
        customer.setLoyaltyPoints(newBalance);
        customerRepository.save(customer);

        // Lưu lịch sử sử dụng điểm
        LoyaltyPointHistory history = new LoyaltyPointHistory();
        history.setCustomer(customer);
        history.setPoints(-pointsToRedeem);
        history.setType(LoyaltyPointType.redeemed);
        history.setDescription(description);
        history.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        loyaltyPointHistoryRepository.save(history);

        log.info("Customer {} redeemed {} points: {}",
                customer.getCustomerCode(), pointsToRedeem, description);
    }    @Transactional
    public void adjustPoints(Integer customerId, int pointsAdjustment, String description) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        int newBalance = customer.getLoyaltyPoints() + pointsAdjustment;
        customer.setLoyaltyPoints(newBalance);
        customerRepository.save(customer);

        LoyaltyPointHistory history = new LoyaltyPointHistory();
        history.setCustomer(customer);
        history.setPoints(pointsAdjustment);
        history.setType(LoyaltyPointType.adjusted);
        history.setDescription(description);
        history.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        loyaltyPointHistoryRepository.save(history);

        log.info("Customer {} points adjusted by {}: {}",
                customer.getCustomerCode(), pointsAdjustment, description);
    }
      @Transactional
    public void deductLoyaltyPoints(Customer customer, Integer points, Order order) {
        if (customer == null || points <= 0) {
            return;
        }

        if (customer.getLoyaltyPoints() < points) {
            throw new IllegalArgumentException("Không đủ điểm tích lũy");
        }

        int newBalance = customer.getLoyaltyPoints() - points;
        customer.setLoyaltyPoints(newBalance);
        customerRepository.save(customer);

        LoyaltyPointHistory history = new LoyaltyPointHistory();
        history.setCustomer(customer);
        history.setPoints(-points);
        history.setType(LoyaltyPointType.redeemed);
        history.setOrder(order);
        history.setDescription("Sử dụng điểm cho đơn hàng " + order.getOrderCode());
        history.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        loyaltyPointHistoryRepository.save(history);
        
        log.info("Customer {} used {} points for order {}", 
                customer.getCustomerCode(), points, order.getOrderCode());
    }
      @Transactional
    public void restoreLoyaltyPoints(Customer customer, Integer points, Order order) {
        if (customer == null || points <= 0) {
            return;
        }

        int newBalance = customer.getLoyaltyPoints() + points;
        customer.setLoyaltyPoints(newBalance);
        customerRepository.save(customer);

        LoyaltyPointHistory history = new LoyaltyPointHistory();
        history.setCustomer(customer);
        history.setPoints(points);
        history.setType(LoyaltyPointType.restored);
        history.setOrder(order);
        history.setDescription("Hoàn trả điểm từ đơn hàng bị hủy " + order.getOrderCode());
        history.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        loyaltyPointHistoryRepository.save(history);
        
        log.info("Customer {} had {} points restored from cancelled order {}", 
                customer.getCustomerCode(), points, order.getOrderCode());
    }
    
    public BigDecimal calculateLoyaltyDiscount(Integer pointsUsed) {
        return BigDecimal.valueOf(pointsUsed * 1000);
    }

    public Page<LoyaltyPointHistoryDTO> getCustomerLoyaltyHistory(Integer customerId, Pageable pageable) {
        validateCustomerExists(customerId);
        
        return loyaltyPointHistoryRepository.findByCustomerIdOrderByCreatedAtDesc(customerId, pageable)
                .map(this::convertToDTO);
    }

    public Page<LoyaltyPointHistoryDTO> getCustomerLoyaltyHistoryByType(
            Integer customerId, LoyaltyPointType type, Pageable pageable) {
        validateCustomerExists(customerId);
        
        return loyaltyPointHistoryRepository.findByCustomerIdAndTypeOrderByCreatedAtDesc(customerId, type, pageable)
                .map(this::convertToDTO);
    }

 
    public Page<LoyaltyPointHistoryDTO> getCustomerLoyaltyHistoryByDateRange(
            Integer customerId, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        validateCustomerExists(customerId);
        
        Timestamp startTimestamp = Timestamp.valueOf(startDate.atStartOfDay());
        Timestamp endTimestamp = Timestamp.valueOf(endDate.atTime(23, 59, 59));
        
        return loyaltyPointHistoryRepository.findByCustomerIdAndDateRange(
                customerId, startTimestamp, endTimestamp, pageable)
                .map(this::convertToDTO);
    }


    public LoyaltyPointSummaryDTO getCustomerLoyaltyPointSummary(Integer customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + customerId));

        Integer totalEarned = loyaltyPointHistoryRepository.sumPointsByCustomerIdAndType(customerId, LoyaltyPointType.earned);
        Integer totalRedeemed = loyaltyPointHistoryRepository.sumPointsByCustomerIdAndType(customerId, LoyaltyPointType.redeemed);
        Integer totalExpired = loyaltyPointHistoryRepository.sumPointsByCustomerIdAndType(customerId, LoyaltyPointType.expired);
        Integer totalAdjusted = loyaltyPointHistoryRepository.sumPointsByCustomerIdAndType(customerId, LoyaltyPointType.adjusted);

        return LoyaltyPointSummaryDTO.builder()
                .customerId(customer.getId())
                .customerName(customer.getFullName())
                .currentPoints(customer.getLoyaltyPoints())
                .totalEarned(totalEarned != null ? totalEarned : 0)
                .totalRedeemed(totalRedeemed != null ? Math.abs(totalRedeemed) : 0) // Số âm thành số dương
                .totalExpired(totalExpired != null ? Math.abs(totalExpired) : 0)
                .totalAdjusted(totalAdjusted != null ? totalAdjusted : 0)
                .build();
    }

   
    public List<LoyaltyPointHistoryDTO> getRecentLoyaltyHistory(Integer customerId) {
        validateCustomerExists(customerId);
        
        return loyaltyPointHistoryRepository.findTop10ByCustomerIdOrderByCreatedAtDesc(customerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    private void validateCustomerExists(Integer customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new IllegalArgumentException("Customer not found with id: " + customerId);
        }
    }

    private LoyaltyPointHistoryDTO convertToDTO(LoyaltyPointHistory history) {
        return LoyaltyPointHistoryDTO.builder()
                .id(history.getId())
                .customerId(history.getCustomer().getId())
                .customerName(history.getCustomer().getFullName())
                .points(history.getPoints())
                .type(history.getType())
                .typeDescription(getTypeDescription(history.getType()))
                .orderId(history.getOrder() != null ? history.getOrder().getId() : null)
                .orderCode(history.getOrder() != null ? history.getOrder().getOrderCode() : null)
                .description(history.getDescription())
                .createdAt(history.getCreatedAt())
                .build();
    }

    private String getTypeDescription(LoyaltyPointType type) {
        switch (type) {
            case earned:
                return "Tích điểm";
            case redeemed:
                return "Đổi điểm";
            case expired:
                return "Hết hạn";
            case adjusted:
                return "Điều chỉnh";
            case restored:
                return "Khôi phục";
            default:
                return type.name();
        }
    }
}