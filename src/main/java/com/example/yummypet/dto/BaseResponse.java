package com.example.yummypet.dto;


import lombok.Data;
import java.time.LocalDateTime;

@Data
public abstract class BaseResponse {
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}