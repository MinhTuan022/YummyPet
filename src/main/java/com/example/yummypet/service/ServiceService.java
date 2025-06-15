package com.example.yummypet.service;

import com.example.yummypet.dto.request.service.ServiceCreateDTO;
import com.example.yummypet.dto.request.service.ServiceUpdateDTO;
import com.example.yummypet.dto.response.service.ServiceResponseDTO;
import com.example.yummypet.entity.Service;
import com.example.yummypet.repository.ServiceRepository;
import com.example.yummypet.specification.ServiceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
@Transactional
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final ServiceMapper serviceMapper;

    public ServiceResponseDTO createService(ServiceCreateDTO createDto) {
        if (serviceRepository.existsByNameIgnoreCase(createDto.getName())) {
            throw new RuntimeException("Service with name '" + createDto.getName() + "' already exists");
        }

        Service service = serviceMapper.toEntity(createDto);
        Service savedService = serviceRepository.save(service);

        return serviceMapper.toResponseDto(savedService);
    }

    @Transactional(readOnly = true)
    public ServiceResponseDTO getServiceById(Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));

        return serviceMapper.toResponseDto(service);
    }

    @Transactional(readOnly = true)
    public Page<ServiceResponseDTO> getAllServices(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Service> services = serviceRepository.findAll(pageable);

        return services.map(serviceMapper::toResponseDto);
    }

    @Transactional(readOnly = true)
    public List<ServiceResponseDTO> getActiveServices() {
        List<Service> services = serviceRepository.findByIsActiveTrue();
        return serviceMapper.toResponseDtoList(services);
    }

    @Transactional(readOnly = true)
    public Page<ServiceResponseDTO> searchServices(String name, Boolean isActive,
                                                   BigDecimal minPrice, BigDecimal maxPrice,
                                                   int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Service> services = serviceRepository.findServicesWithFilters(
                name, isActive, minPrice, maxPrice, pageable);

        return services.map(serviceMapper::toResponseDto);
    }

    public ServiceResponseDTO updateService(Long id, ServiceUpdateDTO updateDto) {
        Service existingService = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));

        if (updateDto.getName() != null && !updateDto.getName().equalsIgnoreCase(existingService.getName())) {
            if (serviceRepository.existsByNameIgnoreCaseAndIdNot(updateDto.getName(), id)) {
                throw new RuntimeException("Service with name '" + updateDto.getName() + "' already exists");
            }
        }

        serviceMapper.updateEntityFromDto(updateDto, existingService);
        Service updatedService = serviceRepository.save(existingService);

        return serviceMapper.toResponseDto(updatedService);
    }

    public void deleteService(Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));

        service.setIsActive(false);
        serviceRepository.save(service);
    }

    public void hardDeleteService(Long id) {
        if (!serviceRepository.existsById(id)) {
            throw new RuntimeException("Service not found with id: " + id);
        }

        serviceRepository.deleteById(id);
    }

    public ServiceResponseDTO toggleServiceStatus(Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));

        service.setIsActive(!service.getIsActive());
        Service updatedService = serviceRepository.save(service);

        return serviceMapper.toResponseDto(updatedService);
    }

    @Transactional(readOnly = true)
    public List<ServiceResponseDTO> getServicesByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        List<Service> services = serviceRepository.findByPriceBetween(minPrice, maxPrice);
        return serviceMapper.toResponseDtoList(services);
    }

    @Transactional(readOnly = true)
    public List<ServiceResponseDTO> getServicesByDurationRange(Integer minDuration, Integer maxDuration) {
        List<Service> services = serviceRepository.findByDurationMinutesBetween(minDuration, maxDuration);
        return serviceMapper.toResponseDtoList(services);
    }
}
