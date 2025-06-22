package com.example.yummypet.service;

import com.example.yummypet.entity.Employee;
import com.example.yummypet.entity.OrderItem;
import com.example.yummypet.entity.Pet;
import com.example.yummypet.entity.Product;
import com.example.yummypet.enums.ItemType;
import com.example.yummypet.enums.PetStatus;
import com.example.yummypet.enums.ServiceStatus;
import com.example.yummypet.repository.EmployeeRepository;
import com.example.yummypet.repository.OrderItemRepository;
import com.example.yummypet.repository.PetRepository;
import com.example.yummypet.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final PetRepository petRepository;

    @Transactional
    public OrderItem createOrderItem(OrderItem orderItem) {
        OrderItem savedItem = orderItemRepository.save(orderItem);

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
    public void restoreInventoryForOrder(Integer orderId) {
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
    }    private final EmployeeRepository employeeRepository;
    
    @Transactional
    public OrderItem updateServiceStatus(Integer orderItemId, ServiceStatus status, Integer employeeId) {
        OrderItem item = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy mục đơn hàng"));
        
        if (item.getItemType() != ItemType.service) {
            throw new IllegalArgumentException("Mục đơn hàng không phải là dịch vụ");
        }
        
        validateServiceStatusTransition(item.getServiceStatus(), status);
        
        item.setServiceStatus(status);
        
        if (status == ServiceStatus.completed) {
            item.setActualCompletionDate(LocalDateTime.now());
        }
        
        if (employeeId != null) {
            Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Nhân viên không tồn tại"));
            item.setAssignedEmployee(employee);
        }
        
        return orderItemRepository.save(item);
    }
    
    private void validateServiceStatusTransition(ServiceStatus from, ServiceStatus to) {
        if (from == to) {
            return;
        }
        
        switch (from) {
            case pending -> {
                if (to != ServiceStatus.in_progress && to != ServiceStatus.cancelled) {
                    throw new IllegalArgumentException("Không thể chuyển từ pending sang " + to);
                }
            }
            case in_progress -> {
                if (to != ServiceStatus.completed && to != ServiceStatus.cancelled) {
                    throw new IllegalArgumentException("Không thể chuyển từ in_progress sang " + to);
                }
            }
            case completed, cancelled -> {
                throw new IllegalArgumentException("Không thể thay đổi trạng thái từ " + from);
            }
        }
    }

    public OrderItem getOrderItemById(Integer id) {
        return orderItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy mục đơn hàng với ID: " + id));
    }
}
