package com.example.yummypet.mapper;

import com.example.yummypet.dto.response.OrderItemDTO;
import com.example.yummypet.entity.OrderItem;

public class OrderItemMapper {

    public static OrderItemDTO toDto(OrderItem entity) {
        if (entity == null) {
            return null;
        }

        OrderItemDTO dto = new OrderItemDTO();

        // Các thông tin cơ bản
        dto.setId(entity.getId());
        dto.setItemType(entity.getItemType());
        dto.setQuantity(entity.getQuantity());
        dto.setUnitPrice(entity.getUnitPrice());
        dto.setTotalPrice(entity.getTotalPrice());
        dto.setCreatedAt(entity.getCreatedAt());

        // Thông tin sản phẩm
        if (entity.getProduct() != null) {
            dto.setProductId(entity.getProduct().getId());
            dto.setProductName(entity.getProduct().getName());
            dto.setProductSku(entity.getProduct().getSku());
        }

        // Thông tin thú cưng
        if (entity.getPet() != null) {
            dto.setPetId(entity.getPet().getId());
            dto.setPetName(entity.getPet().getName());
            dto.setPetCode(entity.getPet().getPetCode());
        }

        // Thông tin dịch vụ
        if (entity.getService() != null) {
            dto.setServiceId(entity.getService().getId());
            dto.setServiceName(entity.getService().getName());
            dto.setServiceDuration(entity.getService().getDurationMinutes());
        }

        dto.setCompletionDate(entity.getCompletionDate());
        dto.setActualCompletionDate(entity.getActualCompletionDate());
        dto.setServiceStatus(entity.getServiceStatus());
        dto.setServiceNotes(entity.getServiceNotes());

        dto.setServiceDetails(entity.getServiceDetails());
        dto.setHealthObservations(entity.getHealthObservations());
        dto.setRecommendations(entity.getRecommendations());
        dto.setNextServiceDate(entity.getNextServiceDate());
        // Thông tin nhân viên được gán
        if (entity.getAssignedEmployee() != null) {
            dto.setAssignedEmployeeId(entity.getAssignedEmployee().getId());
            dto.setAssignedEmployeeName(entity.getAssignedEmployee().getFullName());
        }

        return dto;
    }
}
