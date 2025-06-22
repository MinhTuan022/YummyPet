package com.example.yummypet.entity;

import com.example.yummypet.enums.ItemType;
import com.example.yummypet.enums.ServiceStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
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

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Service service;

    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;

    private LocalDateTime completionDate;
    private LocalDateTime actualCompletionDate;

    @Enumerated(EnumType.STRING)
    private ServiceStatus serviceStatus = ServiceStatus.pending;

    @ManyToOne
    @JoinColumn(name = "assigned_employee_id")
    private Employee assignedEmployee;    @Column(name = "service_notes")
    private String serviceNotes;

    @Column(name = "service_details")
    private String serviceDetails;

    @Column(name = "health_observations")
    private String healthObservations;

    private String recommendations;

    @Column(name = "next_service_date")
    private LocalDate nextServiceDate;

    @Column(name = "created_at")
    private Timestamp createdAt;
}
