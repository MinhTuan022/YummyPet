package com.example.yummypet.service;

import com.example.yummypet.dto.request.employee.EmployeeUpdateRequestDTO;
import com.example.yummypet.dto.response.employee.EmployeeResponseDTO;
import com.example.yummypet.entity.Employee;
import com.example.yummypet.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public List<EmployeeResponseDTO> getAllEmployees() {
        return employeeRepository.findAllWithRoles()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<EmployeeResponseDTO> getAllEmployeesWithPagination(Pageable pageable) {
        return employeeRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    public Optional<EmployeeResponseDTO> getEmployeeById(Integer id) {
        return employeeRepository.findById(id)
                .map(this::convertToDTO);
    }

    public Optional<EmployeeResponseDTO> getEmployeeByUsername(String username) {
        return employeeRepository.findByUsername(username)
                .map(this::convertToDTO);
    }

    public List<EmployeeResponseDTO> getActiveEmployees() {
        return employeeRepository.findByIsActive(true)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<EmployeeResponseDTO> searchEmployees(String keyword, Pageable pageable) {
        return employeeRepository.searchEmployees(keyword, pageable)
                .map(this::convertToDTO);
    }

//    public EmployeeResponseDTO createEmployee(EmployeeRequestDTO requestDTO) {
//        // Kiểm tra trùng lặp
//        if (employeeRepository.existsByUsername(requestDTO.getUsername())) {
//            throw new RuntimeException("Tên đăng nhập đã tồn tại");
//        }
//        if (employeeRepository.existsByEmail(requestDTO.getEmail())) {
//            throw new RuntimeException("Email đã tồn tại");
//        }
//        if (employeeRepository.existsByEmployeeCode(requestDTO.getEmployeeCode())) {
//            throw new RuntimeException("Mã nhân viên đã tồn tại");
//        }
//
//        Employee employee = new Employee();
//        employee.setEmail(requestDTO.getEmail());
//        employee.setEmployeeCode(requestDTO.getEmployeeCode());
//        employee.setFullName(requestDTO.getFullName());
//        employee.setIsActive(requestDTO.getIsActive());
//        employee.setPassword(passwordEncoder.encode(requestDTO.getPassword()));
//        employee.setPhone(requestDTO.getPhone());
//        employee.setUsername(requestDTO.getUsername());
//
//        Employee savedEmployee = employeeRepository.save(employee);
//        return convertToDTO(savedEmployee);
//    }

    public EmployeeResponseDTO updateEmployee(Integer id, EmployeeUpdateRequestDTO requestDTO) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + id));

        if (requestDTO.getUsername() != null &&
                !requestDTO.getUsername().equals(employee.getUsername()) &&
                employeeRepository.existsByUsername(requestDTO.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại");
        }

        if (requestDTO.getEmail() != null &&
                !requestDTO.getEmail().equals(employee.getEmail()) &&
                employeeRepository.existsByEmail(requestDTO.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        if (requestDTO.getEmployeeCode() != null &&
                !requestDTO.getEmployeeCode().equals(employee.getEmployeeCode()) &&
                employeeRepository.existsByEmployeeCode(requestDTO.getEmployeeCode())) {
            throw new RuntimeException("Mã nhân viên đã tồn tại");
        }

        if (requestDTO.getEmail() != null) {
            employee.setEmail(requestDTO.getEmail());
        }
        if (requestDTO.getEmployeeCode() != null) {
            employee.setEmployeeCode(requestDTO.getEmployeeCode());
        }
        if (requestDTO.getFullName() != null) {
            employee.setFullName(requestDTO.getFullName());
        }
        if (requestDTO.getIsActive() != null) {
            employee.setIsActive(requestDTO.getIsActive());
        }
//        if (requestDTO.getPassword() != null) {
//            employee.setPassword(passwordEncoder.encode(requestDTO.getPassword()));
//        }
        if (requestDTO.getPhone() != null) {
            employee.setPhone(requestDTO.getPhone());
        }
        if (requestDTO.getUsername() != null) {
            employee.setUsername(requestDTO.getUsername());
        }
        if (requestDTO.getGender() != null) {
            employee.setGender(requestDTO.getGender());
        }
        if (requestDTO.getAddress() != null) {
            employee.setAddress(requestDTO.getAddress());
        }
        if (requestDTO.getDateOfBirth() != null) {
            employee.setDateOfBirth(requestDTO.getDateOfBirth());
        }

        Employee savedEmployee = employeeRepository.save(employee);
        return convertToDTO(savedEmployee);
    }

    public void deleteEmployee(Integer id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + id));

        // Soft delete - chỉ cập nhật isActive = false
        employee.setIsActive(false);
        employeeRepository.save(employee);
    }

    public void hardDeleteEmployee(Integer id) {
        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy nhân viên với ID: " + id);
        }
        employeeRepository.deleteById(id);
    }

    private EmployeeResponseDTO convertToDTO(Employee employee) {
        return new EmployeeResponseDTO(
                employee.getId(),
                employee.getCreatedAt(),
                employee.getEmail(),
                employee.getEmployeeCode(),
                employee.getFullName(),
                employee.getIsActive(),
                employee.getPhone(),
                employee.getUpdatedAt(),
                employee.getUsername(), employee.getPassword(),
                employee.getRole().getName(),

                employee.getAddress(),
                employee.getGender(),
                employee.getDateOfBirth()
        );
    }
}