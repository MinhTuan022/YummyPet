package com.example.yummypet.repository;

import com.example.yummypet.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    Optional<Employee> findByUsername(String username);
    Optional<Employee> findByEmail(String email);
    boolean existsByUsername(String username);
    Optional<Employee> findByEmployeeCode(String employeeCode);
    boolean existsByEmail(String email);
}