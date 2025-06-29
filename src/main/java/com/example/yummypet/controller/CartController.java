package com.example.yummypet.controller;

import com.example.yummypet.config.UserDetailsImpl;
import com.example.yummypet.dto.request.CartItemRequest;
import com.example.yummypet.dto.request.OrderCreateRequest;
import com.example.yummypet.dto.response.ApiResponse;
import com.example.yummypet.dto.response.CartDTO;
import com.example.yummypet.dto.response.CartItemDTO;
import com.example.yummypet.dto.response.OrderDTO;
import com.example.yummypet.entity.Cart;
import com.example.yummypet.entity.User;
import com.example.yummypet.enums.DeliveryMethod;
import com.example.yummypet.exception.AccessDeniedException;
import com.example.yummypet.exception.BadRequestException;
import com.example.yummypet.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Slf4j
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<CartDTO>> getCart() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser == null) {
            throw new AccessDeniedException("Bạn cần đăng nhập để xem giỏ hàng");
        }
        Cart cart = cartService.getCartByUser(currentUser);
        CartDTO cartDTO = cartService.convertCartToDTO(cart);

        return ResponseEntity.ok(new ApiResponse<>(true, "Giỏ hàng của bạn", cartDTO));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartItemDTO>> addItemToCart(@Valid @RequestBody CartItemRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser == null) {
            throw new AccessDeniedException("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
        }

        CartItemDTO cartItemDTO = cartService.addItemToCart(currentUser, request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Đã thêm sản phẩm vào giỏ hàng", cartItemDTO));
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<ApiResponse<CartItemDTO>> updateCartItem(
            @PathVariable Integer cartItemId,
            @RequestParam Integer quantity) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser == null) {
            throw new AccessDeniedException("Bạn cần đăng nhập để cập nhật giỏ hàng");
        }

        CartItemDTO cartItemDTO = cartService.updateCartItemQuantity(currentUser, cartItemId, quantity);

        return ResponseEntity.ok(new ApiResponse<>(true, "Đã cập nhật giỏ hàng", cartItemDTO));
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<ApiResponse<Void>> removeCartItem(@PathVariable Integer cartItemId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser == null) {
            throw new AccessDeniedException("Bạn cần đăng nhập để xóa sản phẩm khỏi giỏ hàng");
        }

        cartService.removeCartItem(currentUser, cartItemId);

        return ResponseEntity.ok(new ApiResponse<>(true, "Đã xóa sản phẩm khỏi giỏ hàng", null));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearCart() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser == null) {
            throw new AccessDeniedException("Bạn cần đăng nhập để xóa giỏ hàng");
        }

        cartService.clearCart(currentUser);

        return ResponseEntity.ok(new ApiResponse<>(true, "Đã xóa toàn bộ giỏ hàng", null));
    }

    @GetMapping("/items/{cartItemId}")
    public ResponseEntity<ApiResponse<CartItemDTO>> getCartItem(@PathVariable Integer cartItemId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser == null) {
            throw new AccessDeniedException("Bạn cần đăng nhập để xem giỏ hàng");
        }

        CartItemDTO cartItemDTO = cartService.getCartItemById(currentUser, cartItemId);

        return ResponseEntity.ok(new ApiResponse<>(true, "Chi tiết sản phẩm trong giỏ hàng", cartItemDTO));
    }

    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Integer>> getCartItemCount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser == null) {
            throw new AccessDeniedException("Bạn cần đăng nhập để xem giỏ hàng");
        }

        Integer count = cartService.getCartItemCount(currentUser);

        return ResponseEntity.ok(new ApiResponse<>(true, "Tổng số sản phẩm trong giỏ hàng", count));
    }

    @PostMapping("/apply-voucher")
    public ResponseEntity<ApiResponse<CartDTO>> applyVoucher(@RequestParam String code) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser == null) {
            throw new AccessDeniedException("Bạn cần đăng nhập để áp dụng mã giảm giá");
        }

        CartDTO cartDTO = cartService.applyVoucher(currentUser, code);

        return ResponseEntity.ok(new ApiResponse<>(true, "Đã áp dụng mã giảm giá thành công", cartDTO));
    }

    @DeleteMapping("/remove-voucher")
    public ResponseEntity<ApiResponse<CartDTO>> removeVoucher() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser == null) {
            throw new AccessDeniedException("Bạn cần đăng nhập để hủy mã giảm giá");
        }

        CartDTO cartDTO = cartService.removeVoucher(currentUser);

        return ResponseEntity.ok(new ApiResponse<>(true, "Đã hủy mã giảm giá thành công", cartDTO));
    }

    /**
     * Chuyển đổi giỏ hàng thành đơn hàng và thanh toán
     */
    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<OrderDTO>> checkoutCart(
            @RequestBody OrderCreateRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (!(authentication.getPrincipal() instanceof UserDetailsImpl)) {
                throw new AccessDeniedException("Bạn cần đăng nhập để thanh toán");
            }

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User currentUser = userDetails.getUser();
            if (request.getDeliveryAddress() == null || request.getDeliveryAddress().trim().isEmpty()) {
                throw new BadRequestException("Địa chỉ giao hàng không được để trống");
            }

            if (request.getPaymentMethod() == null) {
                throw new BadRequestException("Phương thức thanh toán không được để trống");
            }

            // Đảm bảo là đơn hàng online
            request.setDeliveryMethod(DeliveryMethod.delivery);

            OrderDTO orderDTO = cartService.checkoutCart(currentUser, request);

            return ResponseEntity.ok(new ApiResponse<>(true,
                    "Đặt hàng thành công. Mã đơn hàng: " + orderDTO.getOrderCode(), orderDTO));
        } catch (Exception e) {
            log.error("Error during checkout: {}", e.getMessage(), e);

            if (e.getMessage() != null &&
                    (e.getMessage().contains("rollback-only") ||
                            e.getMessage().contains("transaction silently rolled back"))) {

                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new ApiResponse<>(false,
                                "Lỗi xử lý giao dịch. Vui lòng thử lại sau một vài giây.", null));
            }

            String errorMessage = e.getMessage() != null ? e.getMessage() : "Lỗi không xác định khi thanh toán";
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, errorMessage, null));
        }
    }
}
