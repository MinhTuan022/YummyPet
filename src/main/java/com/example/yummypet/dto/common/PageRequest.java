package com.example.yummypet.dto.common;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageRequest {
    @Min(value = 0, message = "Số trang phải lớn hơn hoặc bằng 0")
    private int page = 0;

    @Min(value = 1, message = "Kích thước trang phải lớn hơn 0")
    private int size = 20;

    private String sortBy = "id";
    private String sortDirection = "ASC";
}

