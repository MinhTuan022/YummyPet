package com.example.yummypet.dto.request;

import com.example.yummypet.enums.ItemType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Data
public class OrderItemRequest {
    @NotNull(message = "Loại mặt hàng không được để trống")
    private ItemType itemType;
    
    @NotNull(message = "Giá đơn vị không được để trống")
    private BigDecimal unitPrice;
    
    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    private Integer quantity;
      // For product items
    private Integer productId;
    
    // For pet items (khi mua/bán thú cưng)
    private Integer petId;
        // For service items (ghi nhận dịch vụ)
    private Integer serviceId;
      /**
     * - Trường này CHỈ áp dụng cho đơn hàng dịch vụ tại cửa hàng (in-store)
     * - KHÔNG áp dụng cho đơn hàng online (vì đơn hàng online không hỗ trợ dịch vụ)
     */
    private Timestamp completionDate;
    
    // Mô tả về dịch vụ, bao gồm cả thông tin thú cưng của khách vãng lai
    private String serviceNotes;
    private Integer assignedEmployeeId;
    
    // Thời gian dự kiến hoàn thành (phút) - nếu muốn ghi đè thời gian mặc định của dịch vụ
    private Integer estimatedDuration;
}
