package com.example.yummypet.entity;

import com.example.yummypet.enums.Gender;
import com.example.yummypet.enums.HealthStatus;
import com.example.yummypet.enums.PetStatus;
import com.example.yummypet.enums.VaccinationStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "pets")
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "pet_code", unique = true, length = 20)
    private String petCode;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    private String name;

    @Column(nullable = false)
    private String species;

    private String breed;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "age_months")
    private Integer ageMonths;

    private BigDecimal weight;
    private String color;
    private BigDecimal price;
    private BigDecimal costPrice;
    private String description;

    @Column(name = "arrival_date")
    private LocalDate arrivalDate;

    @Enumerated(EnumType.STRING)
    private PetStatus status = PetStatus.available;

    @Column(name = "certificate_info")
    private String certificateInfo;

    @Enumerated(EnumType.STRING)
    @Column(name = "health_status")
    private HealthStatus healthStatus = HealthStatus.unknown;

    @Enumerated(EnumType.STRING)
    @Column(name = "vaccination_status")
    private VaccinationStatus vaccinationStatus = VaccinationStatus.unknown;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Transient
    private String imageUrl;

    public String getImageUrl() {
        return imageUrl;
    }
}
