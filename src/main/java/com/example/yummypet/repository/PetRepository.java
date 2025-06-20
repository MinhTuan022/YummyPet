package com.example.yummypet.repository;

import com.example.yummypet.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PetRepository extends JpaRepository<Pet, Integer> {

    @Query("SELECT MAX(p.id) FROM Pet p")
    Optional<Integer> findMaxId();

    Optional<Pet> findByPetCode(String petCode);

    boolean existsByPetCode(String petCode);
}