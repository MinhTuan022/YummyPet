package com.example.yummypet.repository;

import com.example.yummypet.entity.Pet;
import com.example.yummypet.enums.Gender;
import com.example.yummypet.enums.HealthStatus;
import com.example.yummypet.enums.PetStatus;
import com.example.yummypet.enums.VaccinationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PetRepository extends JpaRepository<Pet, Integer> {

    @Query("SELECT MAX(p.id) FROM Pet p")
    Optional<Integer> findMaxId();

    Optional<Pet> findByPetCode(String petCode);

    boolean existsByPetCode(String petCode);
    
    List<Pet> findByIsActive(Boolean isActive);
    
    Page<Pet> findByIsActive(Boolean isActive, Pageable pageable);
    
    List<Pet> findByStatus(PetStatus status);
    
    Page<Pet> findByStatus(PetStatus status, Pageable pageable);
    
    List<Pet> findByCategoryId(Integer categoryId);
    
    Page<Pet> findByCategoryId(Integer categoryId, Pageable pageable);
    
    List<Pet> findBySpecies(String species);
    
    Page<Pet> findBySpecies(String species, Pageable pageable);
    
    Page<Pet> findByCategoryIdAndIsActive(Integer categoryId, Boolean isActive, Pageable pageable);
    
    @Query("SELECT p FROM Pet p WHERE " +
            "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:species IS NULL OR LOWER(p.species) LIKE LOWER(CONCAT('%', :species, '%'))) AND " +
            "(:breed IS NULL OR LOWER(p.breed) LIKE LOWER(CONCAT('%', :breed, '%'))) AND " +
            "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
            "(:gender IS NULL OR p.gender = :gender) AND " +
            "(:minAgeMonths IS NULL OR p.ageMonths >= :minAgeMonths) AND " +
            "(:maxAgeMonths IS NULL OR p.ageMonths <= :maxAgeMonths) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
            "(:status IS NULL OR p.status = :status) AND " +
            "(:healthStatus IS NULL OR p.healthStatus = :healthStatus) AND " +
            "(:vaccinationStatus IS NULL OR p.vaccinationStatus = :vaccinationStatus) AND " +
            "(:isActive IS NULL OR p.isActive = :isActive)")
    Page<Pet> findByFilters(
            @Param("name") String name,
            @Param("species") String species,
            @Param("breed") String breed,
            @Param("categoryId") Integer categoryId,
            @Param("gender") Gender gender,
            @Param("minAgeMonths") Integer minAgeMonths,
            @Param("maxAgeMonths") Integer maxAgeMonths,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("status") PetStatus status,
            @Param("healthStatus") HealthStatus healthStatus,
            @Param("vaccinationStatus") VaccinationStatus vaccinationStatus,
            @Param("isActive") Boolean isActive,
            Pageable pageable);
            
    @Query("SELECT p FROM Pet p WHERE p.arrivalDate BETWEEN :startDate AND :endDate")
    List<Pet> findByArrivalDateBetween(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
            
    @Query("SELECT p FROM Pet p WHERE p.arrivalDate BETWEEN :startDate AND :endDate")
    Page<Pet> findByArrivalDateBetween(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);
            
    @Query("SELECT p FROM Pet p ORDER BY p.price ASC")
    List<Pet> findAllOrderByPriceAsc();
    
    @Query("SELECT p FROM Pet p ORDER BY p.price DESC")
    List<Pet> findAllOrderByPriceDesc();
}