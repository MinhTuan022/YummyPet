package com.example.yummypet.entity;

import com.example.yummypet.enums.ConditionStatus;
import com.example.yummypet.enums.ItemType;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Data
@Table(name = "return_exchange_items")
public class ReturnExchangeItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "return_exchange_id", nullable = false)
    private ReturnExchange returnExchange;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_type", nullable = false)
    private ItemType itemType;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;

    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    private ConditionStatus conditionStatus;

    private String notes;

    @Column(name = "created_at")
    private Timestamp createdAt;
}
