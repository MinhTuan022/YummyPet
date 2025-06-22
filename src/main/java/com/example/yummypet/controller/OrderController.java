package com.example.yummypet.controller;

import com.example.yummypet.config.UserDetailsImpl;
import com.example.yummypet.dto.request.AnonymousOrderRequest;
import com.example.yummypet.dto.request.OrderCreateRequest;
import com.example.yummypet.dto.request.OrderUpdateRequest;
import com.example.yummypet.dto.response.ApiResponse;
import com.example.yummypet.dto.response.OrderDTO;
import com.example.yummypet.entity.Order;
import com.example.yummypet.entity.User;
import com.example.yummypet.enums.DeliveryMethod;
import com.example.yummypet.enums.OrderStatus;
import com.example.yummypet.exception.AccessDeniedException;
import com.example.yummypet.service.OrderService;
import com.example.yummypet.service.OrderServiceUpdated;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {    private final OrderService orderService;
    private final OrderServiceUpdated orderServiceUpdated;
    private final com.example.yummypet.repository.CustomerRepository customerRepository;

    @PostMapping("/in-store")
    public ResponseEntity<ApiResponse<OrderDTO>> createInStoreOrder(@Valid @RequestBody OrderCreateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        Integer authenticatedCustomerId = null;
        if (currentUser != null) {
            var customerOpt = customerRepository.findByUser(currentUser);
            if (customerOpt.isPresent()) {
                authenticatedCustomerId = customerOpt.get().getId();
            }
        }

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("admin"));
        boolean isStaff = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("staff"));

        if (!isAdmin && !isStaff && authenticatedCustomerId != null) {

            if (request.getCustomerId() != null && !request.getCustomerId().equals(authenticatedCustomerId)) {
                log.warn("Attempted to create in-store order with mismatched customer ID. Provided: {}, Actual: {}",
                        request.getCustomerId(), authenticatedCustomerId);

                request.setCustomerId(authenticatedCustomerId);
            }
            if (request.getCustomerId() == null) {
                request.setCustomerId(authenticatedCustomerId);
            }
        }

        Order order = orderService.createOrder(request);
        OrderDTO orderDTO = OrderDTO.fromOrder(order);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Đơn hàng tại cửa hàng đã được tạo thành công", orderDTO));
    }

    @PostMapping("/online")
    public ResponseEntity<ApiResponse<OrderDTO>> createOnlineOrder(@Valid @RequestBody OrderCreateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        Integer authenticatedCustomerId = null;
        if (currentUser != null) {
            var customerOpt = customerRepository.findByUser(currentUser);
            if (customerOpt.isPresent()) {
                authenticatedCustomerId = customerOpt.get().getId();
            }
        }

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("admin"));
        boolean isStaff = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("staff"));

        if (!isAdmin && !isStaff && authenticatedCustomerId != null) {

            if (request.getCustomerId() != null && !request.getCustomerId().equals(authenticatedCustomerId)) {
                log.warn("Attempted to create order with mismatched customer ID. Provided: {}, Actual: {}",
                        request.getCustomerId(), authenticatedCustomerId);

                request.setCustomerId(authenticatedCustomerId);
            }
            if (request.getCustomerId() == null) {
                request.setCustomerId(authenticatedCustomerId);
            }
        }

        Order order = orderService.createOnlineOrder(request);
        OrderDTO orderDTO = OrderDTO.fromOrder(order);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Đơn hàng online đã được tạo thành công", orderDTO));
    }    @GetMapping
    public ResponseEntity<ApiResponse<Page<OrderDTO>>> getAllOrders(
            Pageable pageable,
            @RequestParam(required = false) Integer customerId,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) Boolean guestOnly) {

        Page<Order> orders;
        if (Boolean.TRUE.equals(guestOnly)) {
            orders = orderService.getGuestOrders(pageable);
        } else {
            orders = orderService.getAllOrders(pageable, customerId, status, fromDate, toDate);
        }

        Page<OrderDTO> orderDTOs = orders.map(OrderDTO::fromOrder);
        return ResponseEntity.ok(new ApiResponse<>(true, "Danh sách đơn hàng", orderDTOs));
    }

    @GetMapping("/guest")
    public ResponseEntity<ApiResponse<Page<OrderDTO>>> getGuestOrders(Pageable pageable) {
        Page<Order> orders = orderService.getGuestOrders(pageable);
        Page<OrderDTO> orderDTOs = orders.map(OrderDTO::fromOrder);
        return ResponseEntity.ok(new ApiResponse<>(true, "Danh sách đơn hàng khách vãng lai", orderDTOs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDTO>> getOrderById(@PathVariable Integer id) {
        // Lấy thông tin user hiện tại từ SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("admin"));
        boolean isStaff = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("staff"));

        Order order = orderService.getOrderById(id);

        // Nếu là khách hàng thông thường, chỉ cho phép xem đơn hàng của chính họ
        if (!isAdmin && !isStaff) {
            Integer authenticatedCustomerId = null;
            if (currentUser != null) {
                var customerOpt = customerRepository.findByUser(currentUser);
                if (customerOpt.isPresent()) {
                    authenticatedCustomerId = customerOpt.get().getId();
                }
            }

            // Nếu đơn hàng không thuộc về khách hàng đang đăng nhập, từ chối quyền
            if (authenticatedCustomerId == null ||
                    order.getCustomer() == null ||
                    !authenticatedCustomerId.equals(order.getCustomer().getId())) {
                log.warn("Customer {} attempted to view order {} which does not belong to them",
                        authenticatedCustomerId, id);
                throw new com.example.yummypet.exception.AccessDeniedException(
                        "Bạn không có quyền xem đơn hàng này");
            }
        }

        OrderDTO orderDTO = OrderDTO.fromOrder(order);
        return ResponseEntity.ok(new ApiResponse<>(true, "Thông tin đơn hàng", orderDTO));
    }

    @GetMapping("/code/{orderCode}")
    public ResponseEntity<ApiResponse<OrderDTO>> getOrderByCode(@PathVariable String orderCode) {
        Order order = orderService.getOrderByCode(orderCode);
        OrderDTO orderDTO = OrderDTO.fromOrder(order);
        return ResponseEntity.ok(new ApiResponse<>(true, "Thông tin đơn hàng", orderDTO));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<Page<OrderDTO>>> getOrdersByCustomerId(
            @PathVariable Integer customerId,
            Pageable pageable) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("admin"));
        boolean isStaff = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("staff"));

        if (!isAdmin && !isStaff) {
            Integer authenticatedCustomerId = null;
            if (currentUser != null) {
                var customerOpt = customerRepository.findByUser(currentUser);
                if (customerOpt.isPresent()) {
                    authenticatedCustomerId = customerOpt.get().getId();
                }
            }

            if (authenticatedCustomerId == null || !authenticatedCustomerId.equals(customerId)) {
                log.warn("Customer {} attempted to view orders of customer {}",
                        authenticatedCustomerId, customerId);
                throw new com.example.yummypet.exception.AccessDeniedException(
                        "Bạn không có quyền xem đơn hàng của khách hàng khác");
            }
        }

        Page<Order> orders = orderService.getOrdersByCustomerId(customerId, pageable);
        Page<OrderDTO> orderDTOs = orders.map(OrderDTO::fromOrder);
        return ResponseEntity.ok(new ApiResponse<>(true, "Danh sách đơn hàng của khách hàng", orderDTOs));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderDTO>> updateOrderStatus(
            @PathVariable Integer id,
            @RequestParam OrderStatus status) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Kiểm tra xem người dùng có quyền thay đổi trạng thái đơn hàng không
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("admin"));
        boolean isStaff = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("staff"));

        if (!isAdmin && !isStaff) {
            log.warn("Unauthorized attempt to update order status: {}", authentication.getName());
            throw new com.example.yummypet.exception.AccessDeniedException(
                    "Bạn không có quyền thay đổi trạng thái đơn hàng");
        }

        Order updatedOrder = orderService.updateOrderStatus(id, status);
        OrderDTO orderDTO = OrderDTO.fromOrder(updatedOrder);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật trạng thái đơn hàng thành công", orderDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDTO>> updateOrder(
            @PathVariable Integer id,
            @Valid @RequestBody OrderUpdateRequest request) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("admin"));
        boolean isStaff = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("staff"));

        if (!isAdmin && !isStaff) {
            Order currentOrder = orderService.getOrderById(id);

            Integer authenticatedCustomerId = null;
            if (currentUser != null) {
                var customerOpt = customerRepository.findByUser(currentUser);
                if (customerOpt.isPresent()) {
                    authenticatedCustomerId = customerOpt.get().getId();
                }
            }

            // Nếu đơn hàng không thuộc về khách hàng đang đăng nhập, từ chối quyền
            if (authenticatedCustomerId == null ||
                    currentOrder.getCustomer() == null ||
                    !authenticatedCustomerId.equals(currentOrder.getCustomer().getId())) {
                log.warn("Customer {} attempted to update order {} which does not belong to them",
                        authenticatedCustomerId, id);
                throw new com.example.yummypet.exception.AccessDeniedException(
                        "Bạn không có quyền cập nhật đơn hàng này");
            }
        }

        Order updatedOrder = orderService.updateOrder(id, request);
        OrderDTO orderDTO = OrderDTO.fromOrder(updatedOrder);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật đơn hàng thành công", orderDTO));
    }

    @PostMapping("/{id}/payment")
    public ResponseEntity<ApiResponse<OrderDTO>> confirmPayment(@PathVariable Integer id) {
        // Lấy thông tin user hiện tại từ SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Kiểm tra xem người dùng có quyền xác nhận thanh toán không
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("admin"));
        boolean isStaff = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("staff"));

        // Chỉ admin và staff mới có quyền xác nhận thanh toán
        if (!isAdmin && !isStaff) {
            log.warn("Unauthorized attempt to confirm payment: {}", authentication.getName());
            throw new com.example.yummypet.exception.AccessDeniedException(
                    "Bạn không có quyền xác nhận thanh toán");
        }

        Order order = orderService.confirmPayment(id);
        OrderDTO orderDTO = OrderDTO.fromOrder(order);
        return ResponseEntity.ok(new ApiResponse<>(true, "Xác nhận thanh toán thành công", orderDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> cancelOrder(@PathVariable Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("admin"));
        boolean isStaff = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("staff"));

        if (!isAdmin && !isStaff) {
            Order currentOrder = orderService.getOrderById(id);

            Integer authenticatedCustomerId = null;
            if (currentUser != null) {
                var customerOpt = customerRepository.findByUser(currentUser);
                if (customerOpt.isPresent()) {
                    authenticatedCustomerId = customerOpt.get().getId();
                }
            }

            if (authenticatedCustomerId == null ||
                    currentOrder.getCustomer() == null ||
                    !authenticatedCustomerId.equals(currentOrder.getCustomer().getId())) {
                log.warn("Customer {} attempted to cancel order {} which does not belong to them",
                        authenticatedCustomerId, id);
                throw new com.example.yummypet.exception.AccessDeniedException(
                        "Bạn không có quyền hủy đơn hàng này");
            }

            // Nếu đơn hàng đã qua giai đoạn confirmed, khách hàng không thể tự hủy
            if (currentOrder.getStatus() != OrderStatus.pending) {
                log.warn("Customer {} attempted to cancel order {} which is already in {} state",
                        authenticatedCustomerId, id, currentOrder.getStatus());
                throw new com.example.yummypet.exception.AccessDeniedException(
                        "Đơn hàng đã được xác nhận không thể tự hủy. Vui lòng liên hệ nhân viên hỗ trợ");
            }
        }

        orderService.cancelOrder(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Hủy đơn hàng thành công", null));
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Object>> getOrderStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {

        var statistics = orderService.getOrderStatistics(fromDate, toDate);
        return ResponseEntity.ok(new ApiResponse<>(true, "Thống kê đơn hàng", statistics));
    }

    @PostMapping("/anonymous")
    public ResponseEntity<ApiResponse<OrderDTO>> createAnonymousOrder(
            @Valid @RequestBody AnonymousOrderRequest request) {
        OrderCreateRequest orderRequest = new OrderCreateRequest();
        orderRequest.setPaymentMethod(request.getPaymentMethod());
        orderRequest.setItems(request.getItems());
        orderRequest.setNotes(request.getNotes());
        orderRequest.setVoucherId(request.getVoucherId());

        // Thiết lập mặc định cho đơn hàng ẩn danh
        orderRequest.setDeliveryMethod(DeliveryMethod.pickup); // Mặc định là nhận tại cửa hàng

        // Sử dụng OrderServiceUpdated thay vì OrderService
        Order order = orderServiceUpdated.createAnonymousOrder(orderRequest);
        OrderDTO orderDTO = OrderDTO.fromOrder(order);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Đơn hàng ẩn danh đã được tạo thành công", orderDTO));
    }
}
