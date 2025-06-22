package com.example.yummypet.service;

import com.example.yummypet.dto.request.ServiceRequest;
import com.example.yummypet.entity.Service;
import com.example.yummypet.repository.ServiceRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;
    
    @Transactional(readOnly = true)
    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Page<Service> getAllServices(Pageable pageable) {
        return serviceRepository.findAll(pageable);
    }
    
    @Transactional(readOnly = true)
    public List<Service> getActiveServices() {
        return serviceRepository.findByIsActive(true);
    }
    
    @Transactional(readOnly = true)
    public Page<Service> getActiveServices(Pageable pageable) {
        return serviceRepository.findByIsActive(true, pageable);
    }
    
    @Transactional(readOnly = true)
    public Service getServiceById(Integer id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy dịch vụ với ID: " + id));
    }
    
    @Transactional(readOnly = true)
    public Page<Service> searchServices(
            String name,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Integer minDuration,
            Integer maxDuration,
            Boolean isActive,
            Pageable pageable) {
        
        return serviceRepository.findByFilters(name, minPrice, maxPrice, minDuration, maxDuration, isActive, pageable);
    }
    
    @Transactional(readOnly = true)
    public List<Service> getServicesByPriceAsc() {
        return serviceRepository.findAllOrderByPriceAsc();
    }
    
    @Transactional(readOnly = true)
    public List<Service> getServicesByPriceDesc() {
        return serviceRepository.findAllOrderByPriceDesc();
    }
    
    @Transactional(readOnly = true)
    public List<Service> getTopBookedServices(int limit) {
        return serviceRepository.findTopBookedServices(limit);
    }
    
    @Transactional
    public Service createService(ServiceRequest request) {
        Optional<Service> existingService = serviceRepository.findByName(request.getName());
        if (existingService.isPresent()) {
            throw new IllegalArgumentException("Dịch vụ với tên '" + request.getName() + "' đã tồn tại");
        }
        
        Service service = new Service();
        updateServiceFromRequest(service, request);
        
        Timestamp now = new Timestamp(System.currentTimeMillis());
        service.setCreatedAt(now);
        service.setUpdatedAt(now);
        
        return serviceRepository.save(service);
    }
    
    @Transactional
    public Service updateService(Integer id, ServiceRequest request) {
        Service service = getServiceById(id);
        
        Optional<Service> existingWithSameName = serviceRepository.findByName(request.getName());
        if (existingWithSameName.isPresent() && !existingWithSameName.get().getId().equals(id)) {
            throw new IllegalArgumentException("Dịch vụ với tên '" + request.getName() + "' đã tồn tại");
        }
        
        updateServiceFromRequest(service, request);
        service.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        
        return serviceRepository.save(service);
    }
    
    @Transactional
    public Service toggleServiceStatus(Integer id) {
        Service service = getServiceById(id);
        service.setIsActive(!service.getIsActive());
        service.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        
        return serviceRepository.save(service);
    }
    
    @Transactional
    public void deleteService(Integer id) {
        Service service = getServiceById(id);

        
        service.setIsActive(false); // Thay vì xóa, chỉ vô hiệu hóa
        service.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        serviceRepository.save(service);
    }
    
    private void updateServiceFromRequest(Service service, ServiceRequest request) {
        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setIsActive(request.getIsActive());
    }
}
