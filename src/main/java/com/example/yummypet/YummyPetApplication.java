package com.example.yummypet;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class YummyPetApplication implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(YummyPetApplication.class, args);
    }
    @Override
    public void run(String... args) {
        String encoded = new BCryptPasswordEncoder().encode("123456");
        System.out.println("Mã hóa mật khẩu: " + encoded);
    }
}
