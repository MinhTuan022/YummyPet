package com.example.yummypet.dto.response.customer;

import com.example.yummypet.dto.response.loyalty.LoyaltyPointHistoryDTO;
import com.example.yummypet.dto.response.order.OrderSummaryDTO;
import com.example.yummypet.dto.response.serviceOrder.ServiceOrderSummaryDTO;
import com.example.yummypet.entity.Gender;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CustomerDetailDTO {
    private Integer id;
    private String customerCode;
    private String fullName;
    private String username;
    private String phone;
    private String email;
    private String address;
    private Gender gender;
    private LocalDate dateOfBirth;
    private Integer loyaltyPoints;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Danh sách chi tiết
    private List<CustomerPetSummaryDTO> pets;
    private List<OrderSummaryDTO> recentOrders;
    private List<ServiceOrderSummaryDTO> recentServiceOrders;
    private List<LoyaltyPointHistoryDTO> loyaltyHistory;
}

