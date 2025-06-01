package com.example.yummypet.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "loyalty_point_history")
@Data
@EqualsAndHashCode(exclude = {"customer", "order", "serviceOrder"})
@ToString(exclude = {"customer", "order", "serviceOrder"})
public class LoyaltyPointHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_order_id")
    private ServiceOrder serviceOrder;

    @Column(name = "points_earned")
    private Integer pointsEarned = 0;

    @Column(name = "points_used")
    private Integer pointsUsed = 0;

    @Column(name = "description", length = 200)
    private String description;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;


    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
//
//    @OneToMany(mappedBy = "loyaltyPointHistory", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//    private List<Product> products = new ArrayList<>();
}
