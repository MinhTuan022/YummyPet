package com.example.yummypet.service;

import com.example.yummypet.entity.Order;
import com.example.yummypet.enums.OrderStatus;
import com.example.yummypet.enums.PaymentStatus;
import com.example.yummypet.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Timestamp;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    
    @Mock
    private InventoryService inventoryService;
    
    @Mock
    private LoyaltyPointService loyaltyPointService;
    
    @InjectMocks
    private OrderService orderService;
    
    @Test
    public void testUpdateGuestOrderStatusFromPendingToCompleted() {
        // Arrange
        Order order = new Order();
        order.setId(1);
        order.setOrderCode("TEST-001");
        order.setStatus(OrderStatus.pending);
        order.setIsGuestOrder(true);
        order.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        order.setPaymentStatus(PaymentStatus.pending);
        
        when(orderRepository.findById(1)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArguments()[0]);
        
        // Act
        Order result = orderService.updateOrderStatus(1, OrderStatus.completed);
        
        // Assert
        assertEquals(OrderStatus.completed, result.getStatus());
        assertEquals(PaymentStatus.paid, result.getPaymentStatus());
        
        // Verify inventory was updated for direct pending->completed transition
        verify(inventoryService).updateInventoryAfterOrder(order);
    }
}
