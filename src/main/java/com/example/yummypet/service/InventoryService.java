
package com.example.yummypet.service;

import com.example.yummypet.entity.Order;
import com.example.yummypet.entity.OrderItem;
import com.example.yummypet.entity.Pet;
import com.example.yummypet.entity.Product;
import com.example.yummypet.enums.PetStatus;
import com.example.yummypet.repository.PetRepository;
import com.example.yummypet.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryService {

    private final ProductRepository productRepository;
    private final PetRepository petRepository;

    @Transactional
    public void updateInventoryAfterOrder(Order order) {
        for (OrderItem item : order.getOrderItems()) {
            switch (item.getItemType()) {
                case product:
                    updateProductInventory(item.getProduct().getId(), item.getQuantity(), false);
                    break;
                case pet:
                    updatePetStatus(item.getPet().getId(), PetStatus.sold);
                    break;

            }
        }
        log.info("Updated inventory after order: {}", order.getOrderCode());
    }

    @Transactional
    public void restoreInventoryAfterCancelOrder(Order order) {
        for (OrderItem item : order.getOrderItems()) {
            switch (item.getItemType()) {
                case product:
                    updateProductInventory(item.getProduct().getId(), item.getQuantity(), true);
                    break;
                case pet:
                    updatePetStatus(item.getPet().getId(), PetStatus.available);
                    break;
            }
        }
        log.info("Restored inventory after cancelling order: {}", order.getOrderCode());
    }

    private void updateProductInventory(Integer productId, int quantity, boolean isRestore) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + productId));

        int newQuantity;
        if (isRestore) {
            // Khôi phục tồn kho khi hủy đơn hàng
            newQuantity = product.getStockQuantity() + quantity;
            log.info("Restoring {} units of product {} (current: {}, new: {})",
                    quantity, product.getSku(), product.getStockQuantity(), newQuantity);
        } else {
            // Trừ tồn kho khi đặt hàng
            if (product.getStockQuantity() < quantity) {
                throw new IllegalArgumentException("Insufficient stock for product: " + product.getSku()
                        + ". Available: " + product.getStockQuantity() + ", Required: " + quantity);
            }
            newQuantity = product.getStockQuantity() - quantity;
            log.info("Deducting {} units of product {} (current: {}, new: {})",
                    quantity, product.getSku(), product.getStockQuantity(), newQuantity);
        }

        product.setStockQuantity(newQuantity);
        productRepository.save(product);
    }

    private void updatePetStatus(Integer petId, PetStatus status) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new IllegalArgumentException("Pet not found with id: " + petId));

        PetStatus oldStatus = pet.getStatus();
        pet.setStatus(status);
        petRepository.save(pet);

        log.info("Updated pet {} status from {} to {}",
                pet.getName(), oldStatus, status);
    }

    @Transactional
    public boolean checkProductAvailability(Integer productId, int requiredQuantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + productId));

        boolean isAvailable = product.getStockQuantity() >= requiredQuantity;

        if (!isAvailable) {
            log.warn("Product {} has insufficient stock. Available: {}, Required: {}",
                    product.getSku(), product.getStockQuantity(), requiredQuantity);
        }

        return isAvailable;
    }

    @Transactional
    public boolean checkPetAvailability(Integer petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new IllegalArgumentException("Pet not found with id: " + petId));

        boolean isAvailable = "available".equals(pet.getStatus());

        if (!isAvailable) {
            log.warn("Pet {} is not available. Current status: {}",
                    pet.getName(), pet.getStatus());
        }

        return isAvailable;
    }

    @Transactional
    public void adjustProductStock(Integer productId, int adjustmentQuantity, String reason) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + productId));

        int oldQuantity = product.getStockQuantity();
        int newQuantity = oldQuantity + adjustmentQuantity;

        if (newQuantity < 0) {
            throw new IllegalArgumentException("Stock adjustment would result in negative inventory for product: "
                    + product.getSku());
        }

        product.setStockQuantity(newQuantity);
        productRepository.save(product);

        log.info("Adjusted stock for product {} by {} units (reason: {}). Old: {}, New: {}",
                product.getSku(), adjustmentQuantity, reason, oldQuantity, newQuantity);
    }
}