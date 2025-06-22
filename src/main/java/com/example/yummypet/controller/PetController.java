package com.example.yummypet.controller;

import com.example.yummypet.dto.ApiResponse;
import com.example.yummypet.dto.request.PetImageRequest;
import com.example.yummypet.dto.request.PetRequest;
import com.example.yummypet.dto.response.PetDTO;
import com.example.yummypet.dto.response.PetImageDTO;
import com.example.yummypet.entity.Pet;
import com.example.yummypet.entity.PetImage;
import com.example.yummypet.enums.Gender;
import com.example.yummypet.enums.HealthStatus;
import com.example.yummypet.enums.PetStatus;
import com.example.yummypet.enums.VaccinationStatus;
import com.example.yummypet.service.PetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PetDTO>>> getAllPets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir,
            @RequestParam(required = false) Boolean onlyActive,
            @RequestParam(required = false) Boolean onlyAvailable) {
        
        Sort sort = sortDir.equalsIgnoreCase("DESC") ? 
                Sort.by(sortBy == null ? "id" : sortBy).descending() : 
                Sort.by(sortBy == null ? "id" : sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Pet> pets;
        
        if (onlyActive != null && onlyActive && onlyAvailable != null && onlyAvailable) {
            pets = petService.searchPets(null, null, null, null, null, null, null, 
                    null, null, PetStatus.available, null, null, true, pageable);
        } else if (onlyActive != null && onlyActive) {
            pets = petService.getActivePets(pageable);
        } else if (onlyAvailable != null && onlyAvailable) {
            pets = petService.getAvailablePets(pageable);        } else {
            pets = petService.getAllPets(pageable);
        }
        
        // Chuyển đổi và thêm hình ảnh cho mỗi thú cưng
        Page<PetDTO> petDTOs = pets.map(pet -> {
            List<PetImage> images = petService.getPetImages(pet.getId());
            return PetDTO.fromPetWithImages(pet, images);
        });
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy danh sách thú cưng thành công",
                petDTOs
        ));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PetDTO>> getPetById(@PathVariable Integer id) {
        Pet pet = petService.getPetById(id);
        List<PetImage> images = petService.getPetImages(id);
        PetDTO petDTO = PetDTO.fromPetWithImages(pet, images);
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy thông tin thú cưng thành công",
                petDTO
        ));
    }
    
    @GetMapping("/code/{petCode}")
    public ResponseEntity<ApiResponse<PetDTO>> getPetByPetCode(@PathVariable String petCode) {
        Pet pet = petService.getPetByPetCode(petCode);
        List<PetImage> images = petService.getPetImages(pet.getId());
        PetDTO petDTO = PetDTO.fromPetWithImages(pet, images);
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy thông tin thú cưng thành công",
                petDTO
        ));
    }
      @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<Page<PetDTO>>> getPetsByCategory(
            @PathVariable Integer categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Pet> pets = petService.getPetsByCategory(categoryId, pageable);
        
        // Chuyển đổi và thêm hình ảnh cho mỗi thú cưng
        Page<PetDTO> petDTOs = pets.map(pet -> {
            List<PetImage> images = petService.getPetImages(pet.getId());
            return PetDTO.fromPetWithImages(pet, images);
        });
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy danh sách thú cưng theo danh mục thành công",
                petDTOs
        ));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<PetDTO>>> searchPets(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String species,
            @RequestParam(required = false) String breed,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Gender gender,
            @RequestParam(required = false) Integer minAgeMonths,
            @RequestParam(required = false) Integer maxAgeMonths,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) PetStatus status,
            @RequestParam(required = false) HealthStatus healthStatus,
            @RequestParam(required = false) VaccinationStatus vaccinationStatus,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("DESC") ? 
                Sort.by(sortBy).descending() : 
                Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Pet> pets = petService.searchPets(
                name, species, breed, categoryId, gender,
                minAgeMonths, maxAgeMonths, minPrice, maxPrice,
                status, healthStatus, vaccinationStatus, isActive,
                pageable);
        
        Page<PetDTO> petDTOs = pets.map(PetDTO::fromPet);
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Tìm kiếm thú cưng thành công",
                petDTOs
        ));
    }
    
    @GetMapping("/arrival-date-range")
    public ResponseEntity<ApiResponse<List<PetDTO>>> getPetsByArrivalDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<Pet> pets = petService.getPetsByArrivalDateRange(startDate, endDate);
        List<PetDTO> petDTOs = PetDTO.fromPets(pets);
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy danh sách thú cưng theo ngày nhập thành công",
                petDTOs
        ));
    }
      @GetMapping("/price/asc")
    public ResponseEntity<ApiResponse<List<PetDTO>>> getPetsByPriceAsc() {
        List<Pet> pets = petService.getPetsByPriceAsc();
        
        // Chuyển đổi và thêm hình ảnh cho mỗi thú cưng
        List<PetDTO> petDTOs = pets.stream().map(pet -> {
            List<PetImage> images = petService.getPetImages(pet.getId());
            return PetDTO.fromPetWithImages(pet, images);
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy danh sách thú cưng theo giá tăng dần thành công",
                petDTOs
        ));
    }
    
    @GetMapping("/price/desc")
    public ResponseEntity<ApiResponse<List<PetDTO>>> getPetsByPriceDesc() {
        List<Pet> pets = petService.getPetsByPriceDesc();
        
        // Chuyển đổi và thêm hình ảnh cho mỗi thú cưng
        List<PetDTO> petDTOs = pets.stream().map(pet -> {
            List<PetImage> images = petService.getPetImages(pet.getId());
            return PetDTO.fromPetWithImages(pet, images);
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy danh sách thú cưng theo giá giảm dần thành công",
                petDTOs
        ));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<PetDTO>> createPet(@Valid @RequestBody PetRequest request) {
        Pet createdPet = petService.createPet(request);
        PetDTO petDTO = PetDTO.fromPet(createdPet);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                true,
                "Tạo thú cưng thành công",
                petDTO
        ));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PetDTO>> updatePet(
            @PathVariable Integer id,
            @Valid @RequestBody PetRequest request) {
        
        Pet updatedPet = petService.updatePet(id, request);
        PetDTO petDTO = PetDTO.fromPet(updatedPet);
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Cập nhật thú cưng thành công",
                petDTO
        ));
    }
    
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<PetDTO>> togglePetStatus(@PathVariable Integer id) {
        Pet updatedPet = petService.togglePetStatus(id);
        PetDTO petDTO = PetDTO.fromPet(updatedPet);
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                updatedPet.getIsActive() ? "Kích hoạt thú cưng thành công" : "Vô hiệu hóa thú cưng thành công",
                petDTO
        ));
    }
    
    @PatchMapping("/{id}/mark-sold")
    public ResponseEntity<ApiResponse<PetDTO>> markPetAsSold(@PathVariable Integer id) {
        Pet updatedPet = petService.markPetAsSold(id);
        PetDTO petDTO = PetDTO.fromPet(updatedPet);
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Đánh dấu thú cưng đã bán thành công",
                petDTO
        ));
    }
    
    @PatchMapping("/{id}/mark-available")
    public ResponseEntity<ApiResponse<PetDTO>> markPetAsAvailable(@PathVariable Integer id) {
        Pet updatedPet = petService.markPetAsAvailable(id);
        PetDTO petDTO = PetDTO.fromPet(updatedPet);
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Đánh dấu thú cưng còn hàng thành công",
                petDTO
        ));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePet(@PathVariable Integer id) {
        petService.deletePet(id);
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Xóa thú cưng thành công",
                null
        ));
    }
    
    @GetMapping("/{petId}/images")
    public ResponseEntity<ApiResponse<List<PetImageDTO>>> getPetImages(@PathVariable Integer petId) {
        List<PetImage> images = petService.getPetImages(petId);
        List<PetImageDTO> imageDTOs = images.stream()
                .map(PetImageDTO::fromPetImage)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy danh sách hình ảnh thú cưng thành công",
                imageDTOs
        ));
    }
    
    @PostMapping("/{petId}/images")
    public ResponseEntity<ApiResponse<PetImageDTO>> addPetImage(
            @PathVariable Integer petId,
            @Valid @RequestBody PetImageRequest request) {
        
        PetImage image = petService.addPetImage(petId, request);
        PetImageDTO imageDTO = PetImageDTO.fromPetImage(image);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                true,
                "Thêm hình ảnh thú cưng thành công",
                imageDTO
        ));
    }
    
    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<ApiResponse<Void>> deletePetImage(@PathVariable Integer imageId) {
        petService.deletePetImage(imageId);
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Xóa hình ảnh thú cưng thành công",
                null
        ));
    }
    
    @PatchMapping("/{petId}/images/{imageId}/set-primary")
    public ResponseEntity<ApiResponse<PetImageDTO>> setPrimaryImage(
            @PathVariable Integer petId,
            @PathVariable Integer imageId) {
        
        PetImage primaryImage = petService.setPrimaryImage(petId, imageId);
        PetImageDTO imageDTO = PetImageDTO.fromPetImage(primaryImage);
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Đặt hình ảnh đại diện thành công",
                imageDTO
        ));
    }
}
