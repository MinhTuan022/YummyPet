package com.example.yummypet.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/public")
    public String publicEndpoint() {
        return "This is a public endpoint";
    }

    @GetMapping("/user")
    public String userEndpoint() {
        return "This is a protected endpoint for authenticated users";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminEndpoint() {
        return "This is an admin-only endpoint";
    }

    @GetMapping("/manager")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public String managerEndpoint() {
        return "This is for admin and manager roles";
    }
}