package com.example.yummypet.dto.response;

import com.example.yummypet.entity.OrderItem;
import com.example.yummypet.enums.ItemType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
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

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime completionDate;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime actualCompletionDate;

    private java.sql.Timestamp createdAt;

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

        dto.setCompletionDate(item.getCompletionDate());
        dto.setActualCompletionDate(item.getActualCompletionDate());

        dto.setCreatedAt(item.getCreatedAt());

        return dto;
    }
}
