package com.example.yummypet.controller;

import com.example.yummypet.dto.response.ApiResponse;
import com.example.yummypet.dto.response.OrderItemDTO;
import com.example.yummypet.entity.OrderItem;
import com.example.yummypet.service.OrderItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/order-items")
@RequiredArgsConstructor
public class OrderItemController {

    private final OrderItemService orderItemService;

}
