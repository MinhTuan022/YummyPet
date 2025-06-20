package com.example.yummypet.service;

import com.example.yummypet.entity.OrderItem;
import com.example.yummypet.entity.Pet;
import com.example.yummypet.entity.Product;
import com.example.yummypet.enums.PetStatus;
import com.example.yummypet.repository.OrderItemRepository;
import com.example.yummypet.repository.PetRepository;
import com.example.yummypet.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final PetRepository petRepository;

    @Transactional
    public OrderItem createOrderItem(OrderItem orderItem) {
        // Lưu order item trước
        OrderItem savedItem = orderItemRepository.save(orderItem);

        // Xử lý giảm tồn kho sản phẩm hoặc cập nhật trạng thái thú cưng
        switch (orderItem.getItemType()) {
            case product -> {
                Product product = productRepository.findById(orderItem.getProduct().getId())
                        .orElseThrow(() -> new EntityNotFoundException("Sản phẩm không tồn tại"));
                product.setStockQuantity(product.getStockQuantity() - orderItem.getQuantity());
                productRepository.save(product);
            }
            case pet -> {
                Pet pet = petRepository.findById(orderItem.getPet().getId())
                        .orElseThrow(() -> new EntityNotFoundException("Thú cưng không tồn tại"));
                pet.setStatus(PetStatus.sold);
                petRepository.save(pet);
            }
            default -> {}
        }
        return savedItem;
    }

    @Transactional
    public void restoreInventoryForOrder(Long orderId) {
        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
        for (OrderItem item : items) {
            switch (item.getItemType()) {
                case product -> {
                    Product product = productRepository.findById(item.getProduct().getId())
                            .orElseThrow(() -> new EntityNotFoundException("Sản phẩm không tồn tại"));
                    product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                    productRepository.save(product);
                }
                case pet -> {
                    Pet pet = petRepository.findById(item.getPet().getId())
                            .orElseThrow(() -> new EntityNotFoundException("Thú cưng không tồn tại"));
                    pet.setStatus(PetStatus.available);
                    petRepository.save(pet);
                }
                default -> {}
            }
        }
    }
}
