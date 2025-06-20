package com.example.yummypet.service;


import com.example.yummypet.entity.Pet;
import com.example.yummypet.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final CodeGeneratorService codeGeneratorService;

    @Transactional
    public Pet createPet(Pet pet) {
        // Tạo mã thú cưng nếu chưa có
        if (!StringUtils.hasText(pet.getPetCode())) {
            pet.setPetCode(codeGeneratorService.generatePetCode());
        }

        // Validate mã thú cưng
        if (!codeGeneratorService.isValidPetCode(pet.getPetCode())) {
            throw new IllegalArgumentException("Invalid pet code format");
        }

        // Kiểm tra trùng lặp
        if (petRepository.existsByPetCode(pet.getPetCode())) {
            throw new IllegalArgumentException("Pet code already exists: " + pet.getPetCode());
        }

        log.info("Creating pet with code: {}", pet.getPetCode());
        return petRepository.save(pet);
    }

    @Transactional
    public Pet updatePet(Pet pet) {
        if (!petRepository.existsById(pet.getId())) {
            throw new IllegalArgumentException("Pet not found with id: " + pet.getId());
        }

        log.info("Updating pet with code: {}", pet.getPetCode());
        return petRepository.save(pet);
    }
}

