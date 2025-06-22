package com.example.yummypet.dto.response;

import com.example.yummypet.entity.Cart;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
    
    private Integer id;
    private Integer customerId;
    private String customerName;
    private BigDecimal subtotal;
    private LocalDateTime updatedAt;
    private List<CartItemDTO> items = new ArrayList<>();
    
    // Voucher information
    private Integer voucherId;
    private String voucherCode;
    private BigDecimal discountAmount;
    private BigDecimal finalTotal; // subtotal - discount
    
    public static CartDTO fromCart(Cart cart) {
        if (cart == null) {
            return null;
        }
        
        CartDTO dto = new CartDTO();
        dto.setId(cart.getId());
        
        if (cart.getCustomer() != null) {
            dto.setCustomerId(cart.getCustomer().getId());
            dto.setCustomerName(cart.getCustomer().getFullName());
        }
        
        dto.setSubtotal(cart.getSubtotal());
        dto.setUpdatedAt(cart.getUpdatedAt());
        
        if (cart.getItems() != null) {
            dto.setItems(cart.getItems().stream()
                    .map(CartItemDTO::fromCartItem)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }
}
