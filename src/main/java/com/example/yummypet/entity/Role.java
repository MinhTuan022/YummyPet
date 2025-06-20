package com.example.yummypet.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 50)
    private String name; // 'admin', 'staff', 'customer'

    private String description;

    @Column(name = "created_at")
    private Timestamp createdAt;
}

