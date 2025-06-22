package com.example.yummypet.service;

import com.example.yummypet.dto.request.PetImageRequest;
import com.example.yummypet.dto.request.PetRequest;
import com.example.yummypet.entity.Category;
import com.example.yummypet.entity.Pet;
import com.example.yummypet.entity.PetImage;
import com.example.yummypet.enums.Gender;
import com.example.yummypet.enums.HealthStatus;
import com.example.yummypet.enums.PetStatus;
import com.example.yummypet.enums.VaccinationStatus;
import com.example.yummypet.repository.CategoryRepository;
import com.example.yummypet.repository.PetImageRepository;
import com.example.yummypet.repository.PetRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final PetImageRepository petImageRepository;
    private final CategoryRepository categoryRepository;
    private final CodeGeneratorService codeGeneratorService;

    @Transactional(readOnly = true)
    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Page<Pet> getAllPets(Pageable pageable) {
        return petRepository.findAll(pageable);
    }
    
    @Transactional(readOnly = true)
    public List<Pet> getActivePets() {
        return petRepository.findByIsActive(true);
    }
    
    @Transactional(readOnly = true)
    public Page<Pet> getActivePets(Pageable pageable) {
        return petRepository.findByIsActive(true, pageable);
    }
    
    @Transactional(readOnly = true)
    public List<Pet> getAvailablePets() {
        return petRepository.findByStatus(PetStatus.available);
    }
    
    @Transactional(readOnly = true)
    public Page<Pet> getAvailablePets(Pageable pageable) {
        return petRepository.findByStatus(PetStatus.available, pageable);
    }
    
    @Transactional(readOnly = true)
    public List<Pet> getPetsByCategory(Integer categoryId) {
        return petRepository.findByCategoryId(categoryId);
    }
    
    @Transactional(readOnly = true)
    public Page<Pet> getPetsByCategory(Integer categoryId, Pageable pageable) {
        return petRepository.findByCategoryId(categoryId, pageable);
    }
    
    @Transactional(readOnly = true)
    public Pet getPetById(Integer id) {
        return petRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thú cưng với ID: " + id));
    }
    
    @Transactional(readOnly = true)
    public Pet getPetByPetCode(String petCode) {
        return petRepository.findByPetCode(petCode)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thú cưng với mã: " + petCode));
    }
    
    @Transactional(readOnly = true)
    public Page<Pet> searchPets(
            String name,
            String species,
            String breed,
            Integer categoryId,
            Gender gender,
            Integer minAgeMonths,
            Integer maxAgeMonths,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            PetStatus status,
            HealthStatus healthStatus,
            VaccinationStatus vaccinationStatus,
            Boolean isActive,
            Pageable pageable) {
        
        return petRepository.findByFilters(
                name, species, breed, categoryId, gender,
                minAgeMonths, maxAgeMonths, minPrice, maxPrice,
                status, healthStatus, vaccinationStatus, isActive,
                pageable);
    }
    
    @Transactional(readOnly = true)
    public List<Pet> getPetsByArrivalDateRange(LocalDate startDate, LocalDate endDate) {
        return petRepository.findByArrivalDateBetween(startDate, endDate);
    }
    
    @Transactional(readOnly = true)
    public Page<Pet> getPetsByArrivalDateRange(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        return petRepository.findByArrivalDateBetween(startDate, endDate, pageable);
    }
    
    @Transactional(readOnly = true)
    public List<Pet> getPetsByPriceAsc() {
        return petRepository.findAllOrderByPriceAsc();
    }
    
    @Transactional(readOnly = true)
    public List<Pet> getPetsByPriceDesc() {
        return petRepository.findAllOrderByPriceDesc();
    }
      @Transactional
    public Pet createPet(PetRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với ID: " + request.getCategoryId()));
        
        Pet pet = new Pet();
        
        // Tạo mã thú cưng nếu chưa có
        String petCode;
        if (codeGeneratorService != null) {
            petCode = codeGeneratorService.generatePetCode();
            
            // Validate mã thú cưng
            if (!codeGeneratorService.isValidPetCode(petCode)) {
                throw new IllegalArgumentException("Invalid pet code format");
            }
        } else {
            petCode = generatePetCode();
        }
        
        // Kiểm tra trùng lặp
        if (petRepository.existsByPetCode(petCode)) {
            throw new IllegalArgumentException("Pet code already exists: " + petCode);
        }
        
        pet.setPetCode(petCode);
        updatePetFromRequest(pet, request, category);
        
        Timestamp now = new Timestamp(System.currentTimeMillis());
        pet.setCreatedAt(now);
        pet.setUpdatedAt(now);
        
        log.info("Creating pet with code: {}", pet.getPetCode());
        Pet savedPet = petRepository.save(pet);
        
        // Xử lý các hình ảnh thú cưng nếu có
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            boolean hasPrimary = false;
            
            // Kiểm tra xem có ảnh nào được đánh dấu là primary không
            for (PetImageRequest imageRequest : request.getImages()) {
                if (Boolean.TRUE.equals(imageRequest.getIsPrimary())) {
                    hasPrimary = true;
                    break;
                }
            }
            
            // Thêm các ảnh
            for (int i = 0; i < request.getImages().size(); i++) {
                PetImageRequest imageRequest = request.getImages().get(i);
                
                // Nếu không có ảnh nào được đánh dấu là primary, thì ảnh đầu tiên sẽ là primary
                if (!hasPrimary && i == 0) {
                    imageRequest.setIsPrimary(true);
                }
                
                PetImage petImage = new PetImage();
                petImage.setPet(savedPet);
                petImage.setImageUrl(imageRequest.getImageUrl());
                petImage.setAltText(imageRequest.getAltText());
                petImage.setIsPrimary(imageRequest.getIsPrimary());
                petImage.setDisplayOrder(imageRequest.getDisplayOrder() != null ? imageRequest.getDisplayOrder() : i);
                petImage.setCreatedAt(now);
                
                petImageRepository.save(petImage);
            }
        }
        
        return savedPet;
    }
      @Transactional
    public Pet updatePet(Integer id, PetRequest request) {
        Pet pet = getPetById(id);
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với ID: " + request.getCategoryId()));
        
        updatePetFromRequest(pet, request, category);
        Timestamp now = new Timestamp(System.currentTimeMillis());
        pet.setUpdatedAt(now);
        
        log.info("Updating pet with code: {}", pet.getPetCode());
        Pet savedPet = petRepository.save(pet);
        
        // Nếu có danh sách hình ảnh mới trong request
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            // Xóa tất cả các hình ảnh cũ nếu có ảnh mới
            List<PetImage> existingImages = petImageRepository.findByPetOrderByDisplayOrderAsc(pet);
            if (!existingImages.isEmpty()) {
                for (PetImage image : existingImages) {
                    petImageRepository.delete(image);
                }
            }
            
            boolean hasPrimary = false;
            
            // Kiểm tra xem có ảnh nào được đánh dấu là primary không
            for (PetImageRequest imageRequest : request.getImages()) {
                if (Boolean.TRUE.equals(imageRequest.getIsPrimary())) {
                    hasPrimary = true;
                    break;
                }
            }
            
            // Thêm các ảnh mới
            for (int i = 0; i < request.getImages().size(); i++) {
                PetImageRequest imageRequest = request.getImages().get(i);
                
                // Nếu không có ảnh nào được đánh dấu là primary, thì ảnh đầu tiên sẽ là primary
                if (!hasPrimary && i == 0) {
                    imageRequest.setIsPrimary(true);
                }
                
                PetImage petImage = new PetImage();
                petImage.setPet(savedPet);
                petImage.setImageUrl(imageRequest.getImageUrl());
                petImage.setAltText(imageRequest.getAltText());
                petImage.setIsPrimary(imageRequest.getIsPrimary());
                petImage.setDisplayOrder(imageRequest.getDisplayOrder() != null ? imageRequest.getDisplayOrder() : i);
                petImage.setCreatedAt(now);
                
                petImageRepository.save(petImage);
            }
        }
        
        return savedPet;
    }
    
    @Transactional
    public Pet togglePetStatus(Integer id) {
        Pet pet = getPetById(id);
        pet.setIsActive(!pet.getIsActive());
        pet.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        
        return petRepository.save(pet);
    }
    
    @Transactional
    public Pet markPetAsSold(Integer id) {
        Pet pet = getPetById(id);
        pet.setStatus(PetStatus.sold);
        pet.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        
        return petRepository.save(pet);
    }
    
    @Transactional
    public Pet markPetAsAvailable(Integer id) {
        Pet pet = getPetById(id);
        pet.setStatus(PetStatus.available);
        pet.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        
        return petRepository.save(pet);
    }
    
    @Transactional
    public void deletePet(Integer id) {
        Pet pet = getPetById(id);
        
        // Set to inactive instead of deleting
        pet.setIsActive(false);
        pet.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        petRepository.save(pet);
    }
    
    @Transactional
    public List<PetImage> getPetImages(Integer petId) {
        Pet pet = getPetById(petId);
        return petImageRepository.findByPetOrderByDisplayOrderAsc(pet);
    }
    
    @Transactional
    public PetImage addPetImage(Integer petId, PetImageRequest request) {
        Pet pet = getPetById(petId);
        
        // If this is the first image or it's set as primary, make sure only one primary image exists
        if (request.getIsPrimary() || petImageRepository.countByPetId(petId) == 0) {
            // Set all existing images as non-primary
            petImageRepository.findByPetId(petId).forEach(img -> {
                img.setIsPrimary(false);
                petImageRepository.save(img);
            });
            
            // This image will be primary
            request.setIsPrimary(true);
        }
        
        PetImage petImage = new PetImage();
        petImage.setPet(pet);
        petImage.setImageUrl(request.getImageUrl());
        petImage.setAltText(request.getAltText());
        petImage.setIsPrimary(request.getIsPrimary());
        petImage.setDisplayOrder(request.getDisplayOrder());
        petImage.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        
        return petImageRepository.save(petImage);
    }
    
    @Transactional
    public void deletePetImage(Integer imageId) {
        PetImage image = petImageRepository.findById(imageId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy hình ảnh với ID: " + imageId));
        
        // Check if it's the primary image
        boolean isPrimary = image.getIsPrimary();
        Integer petId = image.getPet().getId();
        
        petImageRepository.delete(image);
        
        // If it was the primary image, set another one as primary if available
        if (isPrimary) {
            List<PetImage> remainingImages = petImageRepository.findByPetIdOrderByDisplayOrderAsc(petId);
            if (!remainingImages.isEmpty()) {
                PetImage newPrimary = remainingImages.get(0);
                newPrimary.setIsPrimary(true);
                petImageRepository.save(newPrimary);
            }
        }
    }
    
    @Transactional
    public PetImage setPrimaryImage(Integer petId, Integer imageId) {
        Pet pet = getPetById(petId);
        PetImage newPrimary = petImageRepository.findById(imageId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy hình ảnh với ID: " + imageId));
        
        // Ensure the image belongs to the pet
        if (!newPrimary.getPet().getId().equals(pet.getId())) {
            throw new IllegalArgumentException("Hình ảnh không thuộc về thú cưng này");
        }
        
        // Set all images as non-primary
        petImageRepository.findByPetId(petId).forEach(img -> {
            img.setIsPrimary(false);
            petImageRepository.save(img);
        });
        
        // Set the selected image as primary
        newPrimary.setIsPrimary(true);
        return petImageRepository.save(newPrimary);
    }
    
    private void updatePetFromRequest(Pet pet, PetRequest request, Category category) {
        pet.setCategory(category);
        pet.setName(request.getName());
        pet.setSpecies(request.getSpecies());
        pet.setBreed(request.getBreed());
        pet.setGender(request.getGender());
        pet.setAgeMonths(request.getAgeMonths());
        pet.setWeight(request.getWeight());
        pet.setColor(request.getColor());
        pet.setPrice(request.getPrice());
        pet.setCostPrice(request.getCostPrice());
        pet.setDescription(request.getDescription());
        pet.setArrivalDate(request.getArrivalDate());
        pet.setStatus(request.getStatus());
        pet.setCertificateInfo(request.getCertificateInfo());
        pet.setHealthStatus(request.getHealthStatus());
        pet.setVaccinationStatus(request.getVaccinationStatus());
        pet.setIsActive(request.getIsActive());
    }
    
    private String generatePetCode() {
        // Generate a pet code in format: PT-YYYYMMDD-XXXX where X is random alphanumeric
        LocalDate now = LocalDate.now();
        String datePart = String.format("%04d%02d%02d", now.getYear(), now.getMonth().getValue(), now.getDayOfMonth());
        
        String randomPart = generateRandomAlphanumeric(4);
        String petCode = "PT-" + datePart + "-" + randomPart;
        
        // Check if it already exists
        while (petRepository.existsByPetCode(petCode)) {
            randomPart = generateRandomAlphanumeric(4);
            petCode = "PT-" + datePart + "-" + randomPart;
        }
        
        return petCode;
    }
    
    private String generateRandomAlphanumeric(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(chars.length());
            sb.append(chars.charAt(index));
        }
        
        return sb.toString();
    }
}

