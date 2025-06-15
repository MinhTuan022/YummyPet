package com.example.yummypet.dto.request.employee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeUpdateRequestDTO {
    @Email(message = "Email không đúng định dạng")
    private String email;

    private String employeeCode;


    private String fullName;


    private Boolean isActive;

//    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
//    private String password;

    @Pattern(regexp = "^[0-9]{10,11}$", message = "Số điện thoại không đúng định dạng")
    private String phone;

    @Size(min = 3, max = 50, message = "Tên đăng nhập phải từ 3-50 ký tự")
    private String username;

    private String gender;

    private String address;
    private LocalDate dateOfBirth;

}