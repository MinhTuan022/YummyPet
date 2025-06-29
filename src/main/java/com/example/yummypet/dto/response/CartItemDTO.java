package com.example.yummypet.dto.response;

import com.example.yummypet.entity.CartItem;
import com.example.yummypet.enums.ItemType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {

    private Integer id;
    private Integer cartId;
    private ItemType itemType;

    private Integer productId;
    private String productName;
    private String productSku;
    private String productImage;

    private Integer petId;
    private String petName;
    private String petSpecies;
    private String petBreed;
    private String petImage;

    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private LocalDateTime updatedAt;

    public static CartItemDTO fromCartItem(CartItem cartItem) {
        if (cartItem == null) {
            return null;
        }

        CartItemDTO dto = new CartItemDTO();
        dto.setId(cartItem.getId());

        if (cartItem.getCart() != null) {
            dto.setCartId(cartItem.getCart().getId());
        }

        dto.setItemType(cartItem.getItemType());
        dto.setQuantity(cartItem.getQuantity());
        dto.setUnitPrice(cartItem.getUnitPrice());
        dto.setTotalPrice(cartItem.getTotalPrice());
        dto.setUpdatedAt(cartItem.getUpdatedAt());

        if (cartItem.getItemType() == ItemType.product && cartItem.getProduct() != null) {
            dto.setProductId(cartItem.getProduct().getId());
            dto.setProductName(cartItem.getProduct().getName());
            dto.setProductSku(cartItem.getProduct().getSku());
            dto.setProductImage(cartItem.getProduct().getImageUrl());
        }
        if (cartItem.getItemType() == ItemType.pet && cartItem.getPet() != null) {
            dto.setPetId(cartItem.getPet().getId());
            dto.setPetName(cartItem.getPet().getName());
            dto.setPetSpecies(cartItem.getPet().getSpecies());
            dto.setPetBreed(cartItem.getPet().getBreed());
            dto.setPetImage(null);
        }

        return dto;
    }
}
