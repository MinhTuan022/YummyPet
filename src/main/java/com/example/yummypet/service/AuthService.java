package com.example.yummypet.service;

import com.example.yummypet.config.JwtUtil;
import com.example.yummypet.dto.request.ChangePasswordRequest;
import com.example.yummypet.dto.request.LoginRequest;
import com.example.yummypet.dto.request.RegisterRequest;
import com.example.yummypet.dto.request.customer.CustomerRegisterDTO;
import com.example.yummypet.dto.response.JwtResponse;
import com.example.yummypet.dto.response.customer.CustomerResponseDTO;
import com.example.yummypet.entity.Customer;
import com.example.yummypet.entity.Employee;
import com.example.yummypet.entity.Role;
import com.example.yummypet.repository.CustomerRepository;
import com.example.yummypet.repository.EmployeeRepository;
import com.example.yummypet.repository.RoleRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PersistenceContext
    private EntityManager entityManager;

    public JwtResponse login(LoginRequest loginRequest) throws AuthenticationException {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsernameOrEmail(), loginRequest.getPassword())
        );

        Employee employee = employeeRepository.findByUsername(loginRequest.getUsernameOrEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(employee.getUsername(), employee.getRole().getName());

        return new JwtResponse(token, employee.getUsername(), employee.getFullName(), employee.getRole().getName());
    }


    @Transactional
    public Employee register(RegisterRequest registerRequest) {
        if (employeeRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        if (registerRequest.getEmail() != null && employeeRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        Role role = roleRepository.findByName(registerRequest.getRoleName())
                .orElseThrow(() -> new RuntimeException("Role not found: " + registerRequest.getRoleName()));

        Employee employee = new Employee();
        employee.setUsername(registerRequest.getUsername());
        employee.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        employee.setFullName(registerRequest.getFullName());
        employee.setPhone(registerRequest.getPhone());
        employee.setEmail(registerRequest.getEmail());
        employee.setRole(role);
        employee.setIsActive(true);

        Employee saved = employeeRepository.save(employee);

        entityManager.refresh(saved);

        return saved;
    }

    public CustomerResponseDTO customerLogin(LoginRequest loginRequest) throws AuthenticationException {
        Customer customer = customerRepository.findByUsername(loginRequest.getUsernameOrEmail())
                .or(() -> customerRepository.findByEmail(loginRequest.getUsernameOrEmail()))
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), customer.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        if (!customer.getIsActive()) {
            throw new RuntimeException("Customer account is inactive");
        }

        String token = jwtUtil.generateToken(customer.getUsername(), "CUSTOMER");

        return new CustomerResponseDTO(
                token,
                customer.getUsername(),
                customer.getFullName(),
                customer.getEmail(),
                customer.getCustomerCode(),
                customer.getLoyaltyPoints(),
                "Customer"
        );
    }

    // Customer Register
    @Transactional
    public Customer customerRegister(CustomerRegisterDTO registerRequest) {
        // Validate unique constraints
        if (customerRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        if (registerRequest.getEmail() != null && customerRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        if (customerRepository.existsByPhone(registerRequest.getPhone())) {
            throw new RuntimeException("Phone number is already in use!");
        }

        Customer customer = new Customer();
        customer.setUsername(registerRequest.getUsername());
        customer.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        customer.setFullName(registerRequest.getFullName());
        customer.setPhone(registerRequest.getPhone());
        customer.setEmail(registerRequest.getEmail());
        customer.setAddress(registerRequest.getAddress());
        customer.setDateOfBirth(registerRequest.getDateOfBirth());
        customer.setLoyaltyPoints(0);
        customer.setIsActive(true);

        Customer saved = customerRepository.save(customer);
        entityManager.refresh(saved);

        return saved;
    }

    // Change password for Employee
    @Transactional
    public void changeEmployeePassword(String username, ChangePasswordRequest changePasswordRequest) {
        Employee employee = employeeRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Verify current password
        if (!passwordEncoder.matches(changePasswordRequest.getCurrentPassword(), employee.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Validate new password confirmation
        if (!changePasswordRequest.getNewPassword().equals(changePasswordRequest.getConfirmNewPassword())) {
            throw new RuntimeException("New password and confirmation do not match");
        }

        // Check if new password is different from current password
        if (passwordEncoder.matches(changePasswordRequest.getNewPassword(), employee.getPassword())) {
            throw new RuntimeException("New password must be different from current password");
        }

        // Update password
        employee.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
        employeeRepository.save(employee);
    }

    // Change password for Customer
    @Transactional
    public void changeCustomerPassword(String username, ChangePasswordRequest changePasswordRequest) {
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Verify current password
        if (!passwordEncoder.matches(changePasswordRequest.getCurrentPassword(), customer.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Validate new password confirmation
        if (!changePasswordRequest.getNewPassword().equals(changePasswordRequest.getConfirmNewPassword())) {
            throw new RuntimeException("New password and confirmation do not match");
        }

        // Check if new password is different from current password
        if (passwordEncoder.matches(changePasswordRequest.getNewPassword(), customer.getPassword())) {
            throw new RuntimeException("New password must be different from current password");
        }

        // Update password
        customer.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
        customerRepository.save(customer);
    }
    // Utility method to check if username belongs to employee or customer
    public String getUserType(String username) {
        if (employeeRepository.existsByUsername(username)) {
            return "EMPLOYEE";
        } else if (customerRepository.existsByUsername(username)) {
            return "CUSTOMER";
        }
        return null;
    }
}
