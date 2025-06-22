package com.example.yummypet.controller;

import com.example.yummypet.dto.response.ApiResponse;
import com.example.yummypet.dto.response.OrderItemDTO;
import com.example.yummypet.entity.OrderItem;
import com.example.yummypet.enums.ServiceStatus;
import com.example.yummypet.service.OrderItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/order-items")
@RequiredArgsConstructor
public class OrderItemController {

    private final OrderItemService orderItemService;

    @PutMapping("/{id}/service-status")
    public ResponseEntity<ApiResponse<OrderItemDTO>> updateServiceStatus(
            @PathVariable Integer id,
            @RequestParam ServiceStatus status,
            @RequestParam(required = false) Integer employeeId) {

        OrderItem updatedItem = orderItemService.updateServiceStatus(id, status, employeeId);
        OrderItemDTO orderItemDTO = OrderItemDTO.fromOrderItem(updatedItem);

        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật trạng thái dịch vụ thành công", orderItemDTO));
    }
}
