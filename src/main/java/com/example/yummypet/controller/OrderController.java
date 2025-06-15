package com.example.yummypet.controller;

import com.example.yummypet.dto.common.ApiResponse;
import com.example.yummypet.dto.request.order.CreateOrderRequestDTO;
import com.example.yummypet.dto.request.order.ReturnExchangeRequestDTO;
import com.example.yummypet.dto.request.order.UpdateOrderStatusRequestDTO;
import com.example.yummypet.dto.response.order.OrderResponseDTO;
import com.example.yummypet.enums.OrderStatus;
import com.example.yummypet.enums.PaymentStatus;
import com.example.yummypet.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponseDTO>> createOrder(@Valid @RequestBody CreateOrderRequestDTO request) {
        OrderResponseDTO order = orderService.createOrder(request);
        return ResponseEntity.ok(ApiResponse.success("Tạo đơn hàng thành công", order));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> updateOrderStatus(
            @PathVariable Integer orderId,
            @Valid @RequestBody UpdateOrderStatusRequestDTO request) {
        OrderResponseDTO order = orderService.updateOrderStatus(orderId, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái đơn hàng thành công", order));
    }

    @PutMapping("/{orderId}/payment")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> processPayment(
            @PathVariable Integer orderId,
            @RequestParam PaymentStatus paymentStatus) {
        OrderResponseDTO order = orderService.processPayment(orderId, paymentStatus);
        return ResponseEntity.ok(ApiResponse.success("Xử lý thanh toán thành công", order));
    }

//    @PostMapping("/return-exchange")
//    public ResponseEntity<ApiResponse<Void>> createReturnExchange(@Valid @RequestBody ReturnExchangeRequestDTO request) {
//        orderService.createReturnExchange(request);
//        return ResponseEntity.ok(ApiResponse.success("Tạo yêu cầu đổi trả thành công", null));
//    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> getOrderById(@PathVariable Integer orderId) {
        OrderResponseDTO order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin đơn hàng thành công", order));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<OrderResponseDTO>>> getAllOrders(Pageable pageable) {
        Page<OrderResponseDTO> orders = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách đơn hàng thành công", orders));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<Page<OrderResponseDTO>>> getOrdersByCustomer(
            @PathVariable Integer customerId,
            Pageable pageable) {
        Page<OrderResponseDTO> orders = orderService.getOrdersByCustomer(customerId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách đơn hàng của khách hàng thành công", orders));
    }

    @PutMapping("/{orderId}/confirm-delivery")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> confirmDelivery(@PathVariable Integer orderId) {
        UpdateOrderStatusRequestDTO request = new UpdateOrderStatusRequestDTO();
        request.setNewStatus(OrderStatus.DELIVERED);
        request.setNotes("Khách hàng xác nhận đã nhận hàng");

        OrderResponseDTO order = orderService.updateOrderStatus(orderId, request);
        return ResponseEntity.ok(ApiResponse.success("Xác nhận nhận hàng thành công", order));
    }
}
