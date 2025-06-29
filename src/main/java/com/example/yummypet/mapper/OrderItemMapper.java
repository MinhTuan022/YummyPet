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

        dto.setCompletionDate(entity.getCompletionDate());
        dto.setActualCompletionDate(entity.getActualCompletionDate());

        return dto;
    }
}
