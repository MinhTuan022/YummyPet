package com.example.yummypet.entity;

import com.example.yummypet.enums.LoyaltyPointType;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Data
@Entity
@Table(name = "loyalty_point_history")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class LoyaltyPointHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;    private Integer points;

    @Enumerated(EnumType.STRING)
    @Column(name = "point_type")
    private LoyaltyPointType type;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(name = "notes")
    private String description;

    @Column(name = "created_at")
    private Timestamp createdAt;
}

