package com.example.yummypet.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "customer_pets")
@Data
@EqualsAndHashCode(exclude = {"customer", "serviceOrders"})
@ToString(exclude = {"customer", "serviceOrders"})
public class CustomerPet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "pet_name", nullable = false, length = 100)
    private String petName;

    @Column(name = "breed", length = 100)
    private String breed;

    @Column(name = "age_months")
    private Integer ageMonths;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Product.Gender gender;

    @Column(name = "weight", precision = 5, scale = 2)
    private BigDecimal weight;

    @Column(name = "special_notes", columnDefinition = "TEXT")
    private String specialNotes;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ServiceOrder> serviceOrders = new ArrayList<>();
}