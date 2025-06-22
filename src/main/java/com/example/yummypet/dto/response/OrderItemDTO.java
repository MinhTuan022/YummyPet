package com.example.yummypet.dto.response;

import com.example.yummypet.entity.OrderItem;
import com.example.yummypet.enums.ItemType;
import com.example.yummypet.enums.ServiceStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class OrderItemDTO {
    private Integer id;
    private ItemType itemType;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;

    private Integer productId;
    private String productName;
    private String productSku;

    private Integer petId;
    private String petName;
    private String petCode;

    private Integer serviceId;
    private String serviceName;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime completionDate;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime actualCompletionDate;
    private ServiceStatus serviceStatus;
    private String serviceNotes;
    private String serviceDetails;
    private String healthObservations;
    private String recommendations;
    private LocalDate nextServiceDate;
    private Integer serviceDuration;

    private Integer assignedEmployeeId;
    private String assignedEmployeeName;

    private Timestamp createdAt;

    // Phương thức tĩnh để chuyển đổi từ OrderItem sang OrderItemDTO
    public static OrderItemDTO fromOrderItem(OrderItem item) {
        if (item == null) {
            return null;
        }

        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(item.getId());
        dto.setItemType(item.getItemType());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setTotalPrice(item.getTotalPrice());

        if (item.getProduct() != null) {
            dto.setProductId(item.getProduct().getId());
            dto.setProductName(item.getProduct().getName());
            dto.setProductSku(item.getProduct().getSku());
        }

        if (item.getPet() != null) {
            dto.setPetId(item.getPet().getId());
            dto.setPetName(item.getPet().getName());
            dto.setPetCode(item.getPet().getPetCode());
        }

        if (item.getService() != null) {
            dto.setServiceId(item.getService().getId());
            dto.setServiceName(item.getService().getName());
        }

        dto.setCompletionDate(item.getCompletionDate());
        dto.setActualCompletionDate(item.getActualCompletionDate());
        dto.setServiceStatus(item.getServiceStatus());
        dto.setServiceNotes(item.getServiceNotes());

        dto.setServiceDetails(item.getServiceDetails());
        dto.setHealthObservations(item.getHealthObservations());
        dto.setRecommendations(item.getRecommendations());
        dto.setNextServiceDate(item.getNextServiceDate());

        if (item.getAssignedEmployee() != null) {
            dto.setAssignedEmployeeId(item.getAssignedEmployee().getId());
            dto.setAssignedEmployeeName(item.getAssignedEmployee().getFullName());
        }

        dto.setCreatedAt(item.getCreatedAt());

        return dto;
    }
}
