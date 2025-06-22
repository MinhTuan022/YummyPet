package com.example.yummypet.dto.response;

import com.example.yummypet.entity.Pet;
import com.example.yummypet.entity.PetImage;
import com.example.yummypet.enums.Gender;
import com.example.yummypet.enums.HealthStatus;
import com.example.yummypet.enums.PetStatus;
import com.example.yummypet.enums.VaccinationStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class PetDTO {
    private Integer id;
    private String petCode;
    private CategoryDTO category;
    private String name;
    private String species;
    private String breed;
    private Gender gender;
    private Integer ageMonths;
    private BigDecimal weight;
    private String color;
    private BigDecimal price;
    private String description;
    private LocalDate arrivalDate;
    private PetStatus status;
    private String certificateInfo;
    private HealthStatus healthStatus;
    private VaccinationStatus vaccinationStatus;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<PetImageDTO> images;
    private String primaryImageUrl;
    
    public static PetDTO fromPet(Pet pet) {
        PetDTO dto = new PetDTO();
        dto.setId(pet.getId());
        dto.setPetCode(pet.getPetCode());
        if (pet.getCategory() != null) {
            dto.setCategory(CategoryDTO.fromCategory(pet.getCategory()));
        }
        dto.setName(pet.getName());
        dto.setSpecies(pet.getSpecies());
        dto.setBreed(pet.getBreed());
        dto.setGender(pet.getGender());
        dto.setAgeMonths(pet.getAgeMonths());
        dto.setWeight(pet.getWeight());
        dto.setColor(pet.getColor());
        dto.setPrice(pet.getPrice());
        dto.setDescription(pet.getDescription());
        dto.setArrivalDate(pet.getArrivalDate());
        dto.setStatus(pet.getStatus());
        dto.setCertificateInfo(pet.getCertificateInfo());
        dto.setHealthStatus(pet.getHealthStatus());
        dto.setVaccinationStatus(pet.getVaccinationStatus());
        dto.setIsActive(pet.getIsActive());
        
        if (pet.getCreatedAt() != null) {
            dto.setCreatedAt(pet.getCreatedAt().toLocalDateTime());
        }
        
        if (pet.getUpdatedAt() != null) {
            dto.setUpdatedAt(pet.getUpdatedAt().toLocalDateTime());
        }
        
        return dto;
    }
    
    public static PetDTO fromPetWithImages(Pet pet, List<PetImage> images) {
        PetDTO dto = fromPet(pet);
        
        if (images != null && !images.isEmpty()) {
            dto.setImages(images.stream()
                    .map(PetImageDTO::fromPetImage)
                    .collect(Collectors.toList()));
            
            images.stream()
                    .filter(PetImage::getIsPrimary)
                    .findFirst()
                    .ifPresent(primaryImage -> dto.setPrimaryImageUrl(primaryImage.getImageUrl()));
            
            if (dto.getPrimaryImageUrl() == null && !images.isEmpty()) {
                dto.setPrimaryImageUrl(images.get(0).getImageUrl());
            }
        }
        
        return dto;
    }
    
    public static List<PetDTO> fromPets(List<Pet> pets) {
        return pets.stream()
                .map(PetDTO::fromPet)
                .collect(Collectors.toList());
    }
}
