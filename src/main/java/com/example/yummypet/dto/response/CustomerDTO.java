package com.example.yummypet.dto.response;

import com.example.yummypet.entity.Customer;
import com.example.yummypet.enums.Gender;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CustomerDTO {
    private Integer id;
    private String customerCode;
    private String fullName;
    private String phone;
    private String email;
    private String address;
    private LocalDate dateOfBirth;
    private Gender gender;
    private Integer loyaltyPoints;
    
    public static CustomerDTO fromCustomer(Customer customer) {
        if (customer == null) {
            return null;
        }
        
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setCustomerCode(customer.getCustomerCode());
        dto.setFullName(customer.getFullName());
        dto.setPhone(customer.getPhone());
        dto.setEmail(customer.getEmail());
        dto.setAddress(customer.getAddress());
        dto.setDateOfBirth(customer.getDateOfBirth());
        dto.setGender(customer.getGender());
        dto.setLoyaltyPoints(customer.getLoyaltyPoints());
        
        return dto;
    }
}
