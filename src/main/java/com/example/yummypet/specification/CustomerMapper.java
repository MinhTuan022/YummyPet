package com.example.yummypet.specification;

import com.example.yummypet.dto.response.customer.CustomerDTO;
import com.example.yummypet.dto.response.customer.CustomerDetailDTO;
import com.example.yummypet.dto.response.customer.CustomerPetSummaryDTO;
import com.example.yummypet.dto.response.loyalty.LoyaltyPointHistoryDTO;
import com.example.yummypet.dto.response.order.OrderSummaryDTO;
import com.example.yummypet.dto.response.serviceOrder.ServiceOrderSummaryDTO;
import com.example.yummypet.entity.Customer;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class CustomerMapper {

    public CustomerDTO toDTO(Customer customer) {
        if (customer == null) return null;

        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setCustomerCode(customer.getCustomerCode());
        dto.setFullName(customer.getFullName());
        dto.setUsername(customer.getUsername());
        dto.setPhone(customer.getPhone());
        dto.setEmail(customer.getEmail());
        dto.setAddress(customer.getAddress());
        dto.setGender(customer.getGender());
        dto.setDateOfBirth(customer.getDateOfBirth());
        dto.setLoyaltyPoints(customer.getLoyaltyPoints());
        dto.setIsActive(customer.getIsActive());
        dto.setCreatedAt(customer.getCreatedAt());
        dto.setUpdatedAt(customer.getUpdatedAt());

        // Thống kê
        dto.setTotalPets(customer.getPets() != null ? customer.getPets().size() : 0);
        dto.setTotalOrders(customer.getOrders() != null ? customer.getOrders().size() : 0);
        dto.setTotalServiceOrders(customer.getServiceOrders() != null ? customer.getServiceOrders().size() : 0);
        dto.setCartItemsCount(customer.getCartItems() != null ? customer.getCartItems().size() : 0);

        return dto;
    }

    public CustomerDetailDTO toDetailDTO(Customer customer) {
        if (customer == null) return null;

        CustomerDetailDTO dto = new CustomerDetailDTO();
        dto.setId(customer.getId());
        dto.setCustomerCode(customer.getCustomerCode());
        dto.setFullName(customer.getFullName());
        dto.setUsername(customer.getUsername());
        dto.setPhone(customer.getPhone());
        dto.setEmail(customer.getEmail());
        dto.setAddress(customer.getAddress());
        dto.setGender(customer.getGender());
        dto.setDateOfBirth(customer.getDateOfBirth());
        dto.setLoyaltyPoints(customer.getLoyaltyPoints());
        dto.setIsActive(customer.getIsActive());
        dto.setCreatedAt(customer.getCreatedAt());
        dto.setUpdatedAt(customer.getUpdatedAt());

        if (customer.getPets() != null) {
            dto.setPets(customer.getPets().stream()
                    .map(this::toPetSummaryDTO)
                    .collect(Collectors.toList()));
        }

        if (customer.getOrders() != null) {
            dto.setRecentOrders(customer.getOrders().stream()
                    .limit(5) // Chỉ lấy 5 đơn hàng gần nhất
                    .map(this::toOrderSummaryDTO)
                    .collect(Collectors.toList()));
        }

        if (customer.getServiceOrders() != null) {
            dto.setRecentServiceOrders(customer.getServiceOrders().stream()
                    .limit(5) // Chỉ lấy 5 đơn dịch vụ gần nhất
                    .map(this::toServiceOrderSummaryDTO)
                    .collect(Collectors.toList()));
        }

        if (customer.getLoyaltyPointHistory() != null) {
            dto.setLoyaltyHistory(customer.getLoyaltyPointHistory().stream()
                    .limit(10) // Chỉ lấy 10 lịch sử gần nhất
                    .map(this::toLoyaltyHistoryDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private CustomerPetSummaryDTO toPetSummaryDTO(com.example.yummypet.entity.CustomerPet pet) {
        CustomerPetSummaryDTO dto = new CustomerPetSummaryDTO();
        dto.setId(pet.getId());
        dto.setBreed(pet.getBreed());
        dto.setGender(pet.getGender() != null ? pet.getGender().toString() : null);
        dto.setAge(pet.getAgeMonths());
        dto.setWeight(pet.getWeight());
        dto.setSpecialNotes(pet.getSpecialNotes());
        return dto;
    }

    private OrderSummaryDTO toOrderSummaryDTO(com.example.yummypet.entity.Order order) {
        OrderSummaryDTO dto = new OrderSummaryDTO();
        dto.setId(order.getId());
        dto.setCreatedAt(order.getCreatedAt());
//        dto.setDeliveryMethod(order.getDeliveryMethod() != null ? order.getDeliveryMethod().toString() : null);
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus() != null ? order.getStatus().toString() : null);
        try {
            dto.setTotalItems(order.getOrderItems() != null ? order.getOrderItems().size() : 0);
        } catch (Exception e) {
            dto.setTotalItems(0);
        }
        return dto;
    }

    private ServiceOrderSummaryDTO toServiceOrderSummaryDTO(com.example.yummypet.entity.ServiceOrder serviceOrder) {
        ServiceOrderSummaryDTO dto = new ServiceOrderSummaryDTO();
        dto.setId(serviceOrder.getId());
        dto.setCreatedAt(serviceOrder.getCreatedAt());
        dto.setTotalAmount(serviceOrder.getTotalAmount());
        dto.setStatus(serviceOrder.getStatus() != null ? serviceOrder.getStatus().toString() : null);
        dto.setPaymentMethod(serviceOrder.getPaymentMethod() != null ? serviceOrder.getPaymentMethod().toString() : null);
        return dto;
    }

    private LoyaltyPointHistoryDTO toLoyaltyHistoryDTO(com.example.yummypet.entity.LoyaltyPointHistory history) {
        LoyaltyPointHistoryDTO dto = new LoyaltyPointHistoryDTO();
        dto.setId(history.getId());
        dto.setCreatedAt(history.getCreatedAt());
        dto.setDescription(history.getDescription());
        dto.setPointsEarned(history.getPointsEarned());
        dto.setPointsUsed(history.getPointsUsed());
        return dto;
    }
}