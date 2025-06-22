package com.example.yummypet.dto.request;

import com.example.yummypet.enums.ReturnExchangeType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ReturnExchangeRequest {
    
    @NotNull(message = "ID đơn hàng không được để trống")
    private Integer orderId;
    
    private Integer customerId; // Có thể null cho đơn hàng khách vãng lai
    
    @NotNull(message = "Loại đổi trả không được để trống")
    private ReturnExchangeType type;
    
    @NotNull(message = "Lý do đổi trả không được để trống")
    private String reason;
    
    @NotEmpty(message = "Cần có ít nhất một sản phẩm đổi trả")
    @Valid
    private List<ReturnExchangeItemRequest> items;
    
    private String notes;
}
