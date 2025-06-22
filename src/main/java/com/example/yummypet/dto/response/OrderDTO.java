package com.example.yummypet.dto.response;

import com.example.yummypet.entity.Order;
import com.example.yummypet.entity.OrderItem;
import com.example.yummypet.enums.DeliveryMethod;
import com.example.yummypet.enums.OrderSource;
import com.example.yummypet.enums.OrderStatus;
import com.example.yummypet.enums.PaymentMethod;
import com.example.yummypet.enums.PaymentStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class OrderDTO {    private Integer id;
    private String orderCode;
    
    // Thông tin khách hàng
    private CustomerDTO customer;
    
    // Thông tin khách vãng lai
    private String guestName;
    private String guestPhone;
    private Boolean isGuestOrder;
    
    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private Integer loyaltyPointsUsed;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private String deliveryAddress;
    private DeliveryMethod deliveryMethod;
    private OrderStatus status;
    private OrderSource orderSource;
    private String notes;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private List<OrderItemDTO> orderItems;
    
    private Integer voucherId;
    private String voucherCode;
    
    public static OrderDTO fromOrder(Order order) {
        if (order == null) {
            return null;
        }
        
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderCode(order.getOrderCode());
        if (order.getIsGuestOrder() != null && order.getIsGuestOrder()) {
            dto.setIsGuestOrder(true);
            dto.setGuestName(order.getGuestName());
            dto.setGuestPhone(order.getGuestPhone());
        } else {
            dto.setIsGuestOrder(false);
            if (order.getCustomer() != null) {
                dto.setCustomer(CustomerDTO.fromCustomer(order.getCustomer()));
            }
        }
        
        dto.setSubtotal(order.getSubtotal());
        dto.setDiscountAmount(order.getDiscountAmount());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setLoyaltyPointsUsed(order.getLoyaltyPointsUsed());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setDeliveryMethod(order.getDeliveryMethod());
        dto.setStatus(order.getStatus());
        dto.setOrderSource(order.getOrderSource());
        dto.setNotes(order.getNotes());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        
        if (order.getVoucher() != null) {
            dto.setVoucherId(order.getVoucher().getId());
            dto.setVoucherCode(order.getVoucher().getCode());
        }
        
        if (order.getOrderItems() != null) {
            dto.setOrderItems(order.getOrderItems().stream()
                    .map(OrderItemDTO::fromOrderItem)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }
}
