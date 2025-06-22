package com.example.yummypet.repository;

import com.example.yummypet.entity.Pet;
import com.example.yummypet.entity.PetImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PetImageRepository extends JpaRepository<PetImage, Integer> {
    List<PetImage> findByPetOrderByDisplayOrderAsc(Pet pet);
    
    List<PetImage> findByPetIdOrderByDisplayOrderAsc(Integer petId);
    
    List<PetImage> findByPetId(Integer petId);
    
    @Query("SELECT pi FROM PetImage pi WHERE pi.pet.id = :petId AND pi.isPrimary = true")
    Optional<PetImage> findPrimaryImageByPetId(@Param("petId") Integer petId);
    
    void deleteByPetId(Integer petId);
    
    long countByPetId(Integer petId);
}
