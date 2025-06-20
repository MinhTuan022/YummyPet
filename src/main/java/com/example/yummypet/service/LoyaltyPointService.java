package com.example.yummypet.service;

import com.example.yummypet.entity.Customer;
import com.example.yummypet.entity.LoyaltyPointHistory;
import com.example.yummypet.entity.Order;
import com.example.yummypet.enums.LoyaltyPointType;
import com.example.yummypet.repository.CustomerRepository;
import com.example.yummypet.repository.LoyaltyPointHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoyaltyPointService {

    private final CustomerRepository customerRepository;
    private final LoyaltyPointHistoryRepository loyaltyPointHistoryRepository;

    // 1 điểm cho mỗi 10,000 VND
    private static final BigDecimal POINTS_RATE = new BigDecimal("10000");

    @Transactional
    public void earnPointsFromOrder(Order order) {
        Customer customer = customerRepository.findById(order.getId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        // Tính điểm tích lũy (1 điểm cho mỗi 10,000 VND)
        int pointsEarned = order.getTotalAmount().divide(POINTS_RATE).intValue();

        if (pointsEarned > 0) {
            // Cập nhật điểm cho khách hàng
            customer.setLoyaltyPoints(customer.getLoyaltyPoints() + pointsEarned);
            customerRepository.save(customer);

            // Lưu lịch sử tích điểm
            LoyaltyPointHistory history = new LoyaltyPointHistory();
            history.setCustomer(customer);
            history.setPoints(pointsEarned);
            history.setType(LoyaltyPointType.earned);
            history.setOrder(order);
            history.setDescription("Tích điểm từ đơn hàng " + order.getOrderCode());

            loyaltyPointHistoryRepository.save(history);

            log.info("Customer {} earned {} points from order {}",
                    customer.getCustomerCode(), pointsEarned, order.getOrderCode());
        }
    }

    @Transactional
    public void redeemPoints(Integer customerId, int pointsToRedeem, String description) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        if (customer.getLoyaltyPoints() < pointsToRedeem) {
            throw new IllegalArgumentException("Insufficient loyalty points");
        }

        // Trừ điểm
        customer.setLoyaltyPoints(customer.getLoyaltyPoints() - pointsToRedeem);
        customerRepository.save(customer);

        // Lưu lịch sử sử dụng điểm
        LoyaltyPointHistory history = new LoyaltyPointHistory();
        history.setCustomer(customer);
        history.setPoints(-pointsToRedeem);
        history.setType(LoyaltyPointType.earned);
        history.setDescription(description);

        loyaltyPointHistoryRepository.save(history);

        log.info("Customer {} redeemed {} points: {}",
                customer.getCustomerCode(), pointsToRedeem, description);
    }

    @Transactional
    public void adjustPoints(Integer customerId, int pointsAdjustment, String description) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        customer.setLoyaltyPoints(customer.getLoyaltyPoints() + pointsAdjustment);
        customerRepository.save(customer);

        // Lưu lịch sử điều chỉnh điểm
        LoyaltyPointHistory history = new LoyaltyPointHistory();
        history.setCustomer(customer);
        history.setPoints(pointsAdjustment);
        history.setType(LoyaltyPointType.adjusted);
        history.setDescription(description);

        loyaltyPointHistoryRepository.save(history);

        log.info("Customer {} points adjusted by {}: {}",
                customer.getCustomerCode(), pointsAdjustment, description);
    }
}