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
@Table(name = "return_exchanges")
@Data
@EqualsAndHashCode(exclude = {"order", "processedBy", "returnExchangeItems"})
@ToString(exclude = {"order", "processedBy", "returnExchangeItems"})
public class ReturnExchange {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private ReturnExchangeType type;

    @Column(name = "reason", nullable = false, length = 500)
    private String reason;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ReturnExchangeStatus status = ReturnExchangeStatus.pending;

    @Column(name = "refund_amount", precision = 15, scale = 0)
    private BigDecimal refundAmount = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_by")
    private Employee processedBy;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "returnExchange", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ReturnExchangeItem> returnExchangeItems = new ArrayList<>();

    public enum ReturnExchangeType {
        return_, exchange
    }

    public enum ReturnExchangeStatus {
        pending, approved, rejected, completed
    }
}
