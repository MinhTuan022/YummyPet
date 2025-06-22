package com.example.yummypet.dto.response;

import com.example.yummypet.entity.ReturnExchange;
import com.example.yummypet.entity.ReturnExchangeItem;
import com.example.yummypet.enums.ReturnExchangeType;
import com.example.yummypet.enums.ReturnStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class ReturnExchangeDTO {
    private Integer id;
    private String returnCode;
    private Integer orderId;
    private String orderCode;
    private CustomerDTO customer;
    private ReturnExchangeType type;
    private String reason;
    private BigDecimal totalAmount;
    private BigDecimal refundAmount;
    private ReturnStatus status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ReturnExchangeItemDTO> items;
    
    public static ReturnExchangeDTO fromEntity(ReturnExchange returnExchange) {
        if (returnExchange == null) {
            return null;
        }
        
        ReturnExchangeDTO dto = new ReturnExchangeDTO();
        dto.setId(returnExchange.getId());
        dto.setReturnCode(returnExchange.getReturnCode());
        dto.setOrderId(returnExchange.getOrder().getId());
        dto.setOrderCode(returnExchange.getOrder().getOrderCode());
        dto.setCustomer(returnExchange.getCustomer() != null ? CustomerDTO.fromCustomer(returnExchange.getCustomer()) : null);
        dto.setType(returnExchange.getType());
        dto.setReason(returnExchange.getReason());
        dto.setTotalAmount(returnExchange.getTotalAmount());
        dto.setRefundAmount(returnExchange.getRefundAmount());
        dto.setStatus(returnExchange.getStatus());
        dto.setNotes(returnExchange.getNotes());
        dto.setCreatedAt(returnExchange.getCreatedAt() != null ? 
                        returnExchange.getCreatedAt().toLocalDateTime() : null);
        dto.setUpdatedAt(returnExchange.getUpdatedAt() != null ? 
                        returnExchange.getUpdatedAt().toLocalDateTime() : null);
        
        return dto;
    }
    
    public static ReturnExchangeDTO fromEntityWithItems(ReturnExchange returnExchange, List<ReturnExchangeItem> items) {
        ReturnExchangeDTO dto = fromEntity(returnExchange);
        if (dto != null && items != null) {
            dto.setItems(items.stream()
                    .map(ReturnExchangeItemDTO::fromEntity)
                    .collect(Collectors.toList()));
        }
        return dto;
    }
}
