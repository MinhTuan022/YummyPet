package com.example.yummypet.dto.response;

import com.example.yummypet.entity.Service;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class ServiceDTO {
    private Integer id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer durationMinutes;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static ServiceDTO fromService(Service service) {
        ServiceDTO dto = new ServiceDTO();
        dto.setId(service.getId());
        dto.setName(service.getName());
        dto.setDescription(service.getDescription());
        dto.setPrice(service.getPrice());
        dto.setDurationMinutes(service.getDurationMinutes());
        dto.setIsActive(service.getIsActive());
        
        if (service.getCreatedAt() != null) {
            dto.setCreatedAt(service.getCreatedAt().toLocalDateTime());
        }
        
        if (service.getUpdatedAt() != null) {
            dto.setUpdatedAt(service.getUpdatedAt().toLocalDateTime());
        }
        
        return dto;
    }
    
    public static List<ServiceDTO> fromServices(List<Service> services) {
        return services.stream()
                .map(ServiceDTO::fromService)
                .collect(Collectors.toList());
    }
}
