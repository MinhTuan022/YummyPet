package com.example.yummypet.entity;

import com.example.yummypet.enums.ItemType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference
    private Order order;

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

    private LocalDateTime completionDate;
    private LocalDateTime actualCompletionDate;

    @Column(name = "created_at")
    private Timestamp createdAt;
}
