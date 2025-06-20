package com.example.yummypet.entity;

import com.example.yummypet.enums.LoyaltyPointType;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Data
@Entity
@Table(name = "loyalty_point_history")
public class LoyaltyPointHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    private Integer points;

    @Enumerated(EnumType.STRING)
    private LoyaltyPointType type;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private String description;

    @Column(name = "created_at")
    private Timestamp createdAt;
}

