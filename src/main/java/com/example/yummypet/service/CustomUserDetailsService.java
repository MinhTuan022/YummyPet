package com.example.yummypet.service;

//package com.petstore.service;

//import com.petstore.entity.Customer;
//import com.petstore.entity.Employee;
import com.example.yummypet.config.CustomUserDetails;
import com.example.yummypet.entity.Customer;
import com.example.yummypet.entity.Employee;
//import com.petstore.repository.CustomerRepository;
//import com.petstore.repository.EmployeeRepository;
import com.example.yummypet.repository.CustomerRepository;
import com.example.yummypet.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Employee employee = employeeRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        List<GrantedAuthority> authorities = new ArrayList<>();
        if (employee.getRole() != null) {
            // Thêm prefix "ROLE_"
            authorities.add(new SimpleGrantedAuthority("ROLE_" + employee.getRole().getName()));
        }

        return new org.springframework.security.core.userdetails.User(
                employee.getUsername(),
                employee.getPassword(),
                employee.getIsActive(),
                true,
                true,
                true,
                authorities
        );
    }
}

