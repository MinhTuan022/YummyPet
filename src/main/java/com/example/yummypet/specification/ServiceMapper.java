package com.example.yummypet.specification;

import com.example.yummypet.dto.request.service.ServiceCreateDTO;
import com.example.yummypet.dto.request.service.ServiceUpdateDTO;
import com.example.yummypet.dto.response.service.ServiceResponseDTO;
import com.example.yummypet.entity.Service;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ServiceMapper {

    public ServiceResponseDTO toResponseDto(Service service) {
        if (service == null) {
            return null;
        }

        ServiceResponseDTO dto = new ServiceResponseDTO();
        dto.setId(service.getId());
        dto.setName(service.getName());
        dto.setDescription(service.getDescription());
        dto.setDurationMinutes(service.getDurationMinutes());
        dto.setPrice(service.getPrice());
        dto.setIsActive(service.getIsActive());
        dto.setCreatedAt(service.getCreatedAt());
        dto.setUpdatedAt(service.getUpdatedAt());

        return dto;
    }

    public Service toEntity(ServiceCreateDTO createDto) {
        if (createDto == null) {
            return null;
        }

        Service service = new Service();
        service.setName(createDto.getName());
        service.setDescription(createDto.getDescription());
        service.setDurationMinutes(createDto.getDurationMinutes());
        service.setPrice(createDto.getPrice());
        service.setIsActive(true); // Default to active

        return service;
    }

    public void updateEntityFromDto(ServiceUpdateDTO updateDto, Service service) {
        if (updateDto == null || service == null) {
            return;
        }

        if (updateDto.getName() != null) {
            service.setName(updateDto.getName());
        }

        if (updateDto.getDescription() != null) {
            service.setDescription(updateDto.getDescription());
        }

        if (updateDto.getDurationMinutes() != null) {
            service.setDurationMinutes(updateDto.getDurationMinutes());
        }

        if (updateDto.getPrice() != null) {
            service.setPrice(updateDto.getPrice());
        }

        if (updateDto.getIsActive() != null) {
            service.setIsActive(updateDto.getIsActive());
        }
    }

    public List<ServiceResponseDTO> toResponseDtoList(List<Service> services) {
        if (services == null) {
            return null;
        }

        return services.stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }
}
