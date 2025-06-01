package com.example.yummypet.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "return_exchange_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReturnExchangeItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "return_exchange_id", nullable = false)
    private ReturnExchange returnExchange;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    @Column(nullable = false)
    private Integer quantity;

    @Column(length = 500)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition_status", nullable = false)
    private ConditionStatus conditionStatus;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Enum for condition status
    public enum ConditionStatus {
        good, damaged, defective
    }

    // Constructor without ID for creating new instances
    public ReturnExchangeItem(ReturnExchange returnExchange, OrderItem orderItem,
                              Integer quantity, String reason, ConditionStatus conditionStatus) {
        this.returnExchange = returnExchange;
        this.orderItem = orderItem;
        this.quantity = quantity;
        this.reason = reason;
        this.conditionStatus = conditionStatus;
    }
}