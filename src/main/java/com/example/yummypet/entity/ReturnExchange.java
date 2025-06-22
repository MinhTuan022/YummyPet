package com.example.yummypet.entity;

import com.example.yummypet.enums.ReturnExchangeType;
import com.example.yummypet.enums.ReturnStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Data
@Table(name = "return_exchanges")
public class ReturnExchange {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "return_code", nullable = false, unique = true, length = 20)
    private String returnCode;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;    @Enumerated(EnumType.STRING)
    @Column(name = "return_type")
    private ReturnExchangeType type;

    @Column(nullable = false)
    private String reason;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "refund_amount")
    private BigDecimal refundAmount;

    @Enumerated(EnumType.STRING)
    private ReturnStatus status = ReturnStatus.pending;    @ManyToOne
    @JoinColumn(name = "processed_by")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User processedBy;

    @Column(name = "processed_at")
    private Timestamp processedAt;

    private String notes;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @Column(name = "updated_at")
    private Timestamp updatedAt;
}
