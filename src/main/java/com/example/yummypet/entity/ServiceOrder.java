package com.example.yummypet.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "service_orders")
@Data
@EqualsAndHashCode(exclude = {"customer", "employee", "pet", "voucher", "serviceOrderItems", "loyaltyPointHistory"})
@ToString(exclude = {"customer", "employee", "pet", "voucher", "serviceOrderItems", "loyaltyPointHistory"})
public class ServiceOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "order_code", unique = true, nullable = false, length = 20)
    private String orderCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id")
    private CustomerPet pet;

    @Column(name = "total_amount", nullable = false, precision = 15, scale = 0)
    private BigDecimal totalAmount;

    @Column(name = "discount_amount", precision = 15, scale = 0)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "final_amount", nullable = false, precision = 15, scale = 0)
    private BigDecimal finalAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private ServicePaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private Order.PaymentStatus paymentStatus = Order.PaymentStatus.pending;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ServiceStatus status = ServiceStatus.pending;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "service_date", nullable = false)
    private LocalDateTime serviceDate;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "serviceOrder", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ServiceOrderItem> serviceOrderItems = new ArrayList<>();

    @OneToMany(mappedBy = "serviceOrder", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<LoyaltyPointHistory> loyaltyPointHistory = new ArrayList<>();

    public enum ServicePaymentMethod {
        cash, card, transfer
    }

    public enum ServiceStatus {
        pending, in_progress, completed, cancelled
    }
}