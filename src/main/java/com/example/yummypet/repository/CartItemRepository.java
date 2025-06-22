package com.example.yummypet.repository;

import com.example.yummypet.entity.CartItem;
import com.example.yummypet.enums.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

    @Query("SELECT ci FROM CartItem ci WHERE ci.cart.id = :cartId AND ci.itemType = :itemType " +
           "AND (:itemType = 'product' AND ci.product.id = :itemId " +
           "OR :itemType = 'pet' AND ci.pet.id = :itemId " +
           "OR :itemType = 'service' AND ci.service.id = :itemId)")
    Optional<CartItem> findByCartIdAndItemTypeAndItemId(Integer cartId, ItemType itemType, Integer itemId);

    @Modifying
    void deleteByCartId(Integer cartId);
}
