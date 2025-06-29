package com.example.yummypet.service;

import com.example.yummypet.dto.request.CartItemRequest;
import com.example.yummypet.dto.request.OrderCreateRequest;
import com.example.yummypet.dto.request.OrderItemRequest;
import com.example.yummypet.dto.response.CartDTO;
import com.example.yummypet.dto.response.CartItemDTO;
import com.example.yummypet.dto.response.OrderDTO;
import com.example.yummypet.entity.*;
import com.example.yummypet.enums.DeliveryMethod;
import com.example.yummypet.enums.ItemType;
import com.example.yummypet.enums.PetStatus;
import com.example.yummypet.exception.AccessDeniedException;
import com.example.yummypet.exception.BadRequestException;
import com.example.yummypet.exception.ResourceNotFoundException;
import com.example.yummypet.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final PetRepository petRepository;
    private final PetImageRepository petImageRepository;
    private final VoucherRepository voucherRepository;
    private final VoucherService voucherService;
    private final OrderService orderService;

    public Cart getCartByUser(User user) {
        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin khách hàng"));

        return cartRepository.findByCustomerId(customer.getId())
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .customer(customer)
                            .subtotal(BigDecimal.ZERO)
                            .build();
                    return cartRepository.save(newCart);
                });
    }

    @Transactional
    public CartItemDTO addItemToCart(User user, CartItemRequest request) {
        validateCartItemRequest(request);

        if (request.getItemType() == ItemType.product) {
            if (!validateStock(request)) {
                throw new BadRequestException("Số lượng sản phẩm trong kho không đủ");
            }
        }

        Cart cart = getCartByUser(user);

        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndItemTypeAndItemId(
                cart.getId(),
                request.getItemType(),
                getItemIdFromRequest(request));

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();

            if (request.getItemType() == ItemType.product) {
                Product product = productRepository.findById(request.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

                if (product.getStockQuantity() < (item.getQuantity() + request.getQuantity())) {
                    throw new BadRequestException("Số lượng sản phẩm trong kho không đủ");
                }
            }

            item.setQuantity(item.getQuantity() + request.getQuantity());
            item.setUpdatedAt(LocalDateTime.now());
            CartItem savedItem = cartItemRepository.save(item);

            updateCartTotal(cart);

            return convertToDTO(savedItem);
        } else {
            CartItem newItem = createCartItemFromRequest(cart, request);
            CartItem savedItem = cartItemRepository.save(newItem);

            updateCartTotal(cart);

            return convertToDTO(savedItem);
        }
    }

    @Transactional
    public CartItemDTO updateCartItemQuantity(User user, Integer cartItemId, Integer quantity) {
        if (quantity <= 0) {
            throw new BadRequestException("Số lượng phải lớn hơn 0");
        }

        Cart cart = getCartByUser(user);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Sản phẩm không thuộc giỏ hàng của bạn");
        }

        cartItem.setQuantity(quantity);
        cartItem.setUpdatedAt(LocalDateTime.now());
        CartItem savedItem = cartItemRepository.save(cartItem);
        updateCartTotal(cart);

        return convertToDTO(savedItem);
    }


    @Transactional
    public void removeCartItem(User user, Integer cartItemId) {
        Cart cart = getCartByUser(user);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Sản phẩm không thuộc giỏ hàng của bạn");
        }

        cartItemRepository.delete(cartItem);

        updateCartTotal(cart);
    }

    @Transactional
    public void clearCart(User user) {
        Cart cart = getCartByUser(user);

        cartItemRepository.deleteByCartId(cart.getId());

        cart.setSubtotal(BigDecimal.ZERO);
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
    }


    private void validateCartItemRequest(CartItemRequest request) {
        if (request.getItemType() == ItemType.product && request.getProductId() == null) {
            throw new BadRequestException("ProductId không được để trống cho loại sản phẩm");
        } else if (request.getItemType() == ItemType.pet && request.getPetId() == null) {
            throw new BadRequestException("PetId không được để trống cho loại thú cưng");
        }

        if (request.getItemType() == ItemType.product) {
            productRepository.findById(request.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));
        } else if (request.getItemType() == ItemType.pet) {
            petRepository.findById(request.getPetId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thú cưng"));
        }

        if (!validateStock(request)) {
            throw new BadRequestException("Số lượng sản phẩm vượt quá số lượng tồn kho");
        }
    }

    private Integer getItemIdFromRequest(CartItemRequest request) {
        if (request.getItemType() == ItemType.product) {
            return request.getProductId();
        } else if (request.getItemType() == ItemType.pet) {
            return request.getPetId();
        }
        return null;
    }


    private CartItem createCartItemFromRequest(Cart cart, CartItemRequest request) {
        CartItem newItem = CartItem.builder()
                .cart(cart)
                .itemType(request.getItemType())
                .quantity(request.getQuantity())
                .build();

        if (request.getItemType() == ItemType.product) {
            Product product = productRepository.findById(request.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));
            newItem.setProduct(product);
            newItem.setUnitPrice(product.getPrice());

        } else if (request.getItemType() == ItemType.pet) {
            Pet pet = petRepository.findById(request.getPetId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thú cưng"));
            newItem.setPet(pet);
            newItem.setUnitPrice(pet.getPrice());
        }

        return newItem;
    }


    private void updateCartTotal(Cart cart) {
        cart.recalculateSubtotal();
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
    }


    private CartItemDTO convertToDTO(CartItem cartItem) {
        if (cartItem == null) {
            return null;
        }

        CartItemDTO dto = CartItemDTO.fromCartItem(cartItem);

        if (cartItem.getItemType() == ItemType.pet && cartItem.getPet() != null) {
            petImageRepository.findPrimaryImageByPetId(cartItem.getPet().getId())
                    .ifPresent(petImage -> {
                        dto.setPetImage(petImage.getImageUrl());
                    });
        }

        return dto;
    }

    public CartDTO convertCartToDTO(Cart cart) {
        if (cart == null) {
            return null;
        }

        CartDTO dto = new CartDTO();
        dto.setId(cart.getId());

        if (cart.getCustomer() != null) {
            dto.setCustomerId(cart.getCustomer().getId());
            dto.setCustomerName(cart.getCustomer().getFullName());
        }

        dto.setSubtotal(cart.getSubtotal());
        dto.setUpdatedAt(cart.getUpdatedAt());

        if (cart.getItems() != null) {
            dto.setItems(cart.getItems().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList()));
        }

        dto.setDiscountAmount(BigDecimal.ZERO);
        dto.setFinalTotal(cart.getSubtotal());

        return dto;
    }

    public Integer getCartItemCount(User user) {
        Cart cart = getCartByUser(user);
        if (cart == null || cart.getItems() == null || cart.getItems().isEmpty()) {
            return 0;
        }

        return cart.getItems().stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }


    public CartItemDTO getCartItemById(User user, Integer cartItemId) {
        Cart cart = getCartByUser(user);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Sản phẩm không thuộc giỏ hàng của bạn");
        }

        return convertToDTO(cartItem);
    }

    public boolean isItemInCart(User user, ItemType itemType, Integer itemId) {
        Cart cart = getCartByUser(user);

        return cartItemRepository.findByCartIdAndItemTypeAndItemId(
                cart.getId(),
                itemType,
                itemId).isPresent();
    }

    private boolean validateStock(CartItemRequest request) {
        if (request.getItemType() != ItemType.product) {
            return true;
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

        int currentQtyInCart = 0;

        return product.getStockQuantity() >= (currentQtyInCart + request.getQuantity());
    }


    @Transactional
    public CartDTO applyVoucher(User user, String voucherCode) {
        Cart cart = getCartByUser(user);

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Không thể áp dụng mã giảm giá cho giỏ hàng trống");
        }

        Voucher voucher = voucherRepository.findByCode(voucherCode)
                .orElseThrow(() -> new ResourceNotFoundException("Mã giảm giá không hợp lệ"));

        if (!voucherService.isVoucherValid(voucher)) {
            throw new BadRequestException("Mã giảm giá đã hết hạn hoặc không khả dụng");
        }

        if (voucher.getMinOrderAmount() != null && cart.getSubtotal().compareTo(voucher.getMinOrderAmount()) < 0) {
            throw new BadRequestException("Tổng giá trị giỏ hàng chưa đạt điều kiện áp dụng mã giảm giá (tối thiểu " +
                    voucher.getMinOrderAmount() + " VNĐ)");
        }

        BigDecimal discountAmount = voucherService.calculateDiscount(voucher, cart.getSubtotal());



        CartDTO cartDTO = convertCartToDTO(cart);
        cartDTO.setVoucherId(voucher.getId());
        cartDTO.setVoucherCode(voucher.getCode());
        cartDTO.setDiscountAmount(discountAmount);
        cartDTO.setFinalTotal(cart.getSubtotal().subtract(discountAmount));

        return cartDTO;
    }

    public CartDTO removeVoucher(User user) {
        Cart cart = getCartByUser(user);


        return convertCartToDTO(cart);
    }


    @Transactional
    public OrderDTO checkoutCart(User user, OrderCreateRequest orderRequest) {
        if (user == null) {
            throw new AccessDeniedException("Bạn cần đăng nhập để thực hiện thanh toán");
        }

        Cart cart = getCartByUser(user);

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Không thể thanh toán giỏ hàng trống");
        }

        if (orderRequest.getDeliveryAddress() == null || orderRequest.getDeliveryAddress().trim().isEmpty()) {
            throw new BadRequestException("Địa chỉ giao hàng không được để trống");
        }

        if (orderRequest.getDeliveryMethod() == null) {
            orderRequest.setDeliveryMethod(DeliveryMethod.delivery);
        }

        if (orderRequest.getPaymentMethod() == null) {
            throw new BadRequestException("Phương thức thanh toán không được để trống");
        }

        orderRequest.setCustomerId(cart.getCustomer().getId());
        List<OrderItemRequest> orderItems = cart.getItems().stream()
                .map(cartItem -> {
                    OrderItemRequest itemRequest = new OrderItemRequest();
                    itemRequest.setItemType(cartItem.getItemType());
                    itemRequest.setQuantity(cartItem.getQuantity());
                    itemRequest.setUnitPrice(cartItem.getUnitPrice());

                    switch (cartItem.getItemType()) {
                        case product:
                            itemRequest.setProductId(cartItem.getProduct().getId());
                            break;
                        case pet:
                            itemRequest.setPetId(cartItem.getPet().getId());
                            break;
                    }

                    return itemRequest;
                })
                .collect(Collectors.toList());

        orderRequest.setItems(orderItems);

        try {
            validateInventoryForCheckout(cart);

            Order order = orderService.createOnlineOrder(orderRequest);

            Integer cartId = cart.getId();

            OrderDTO orderDTO = OrderDTO.fromOrder(order);

            deleteCartAfterCheckout(user, cartId);

            return orderDTO;
        } catch (Exception e) {
            log.error("Error during checkout process: {}", e.getMessage(), e);
            throw new BadRequestException("Lỗi khi thanh toán: " + e.getMessage());
        }
    }


    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteCartAfterCheckout(User user, Integer cartId) {
        try {
            log.info("Starting to clear cart in separate transaction for user: {}, cartId: {}",
                    user.getUsername(), cartId);

            Cart cart = cartRepository.findById(cartId).orElse(null);
            if (cart == null) {
                log.warn("Cart not found for clearing after checkout. CartId: {}", cartId);
                return;
            }

            log.info("Disconnecting and deleting {} cart items for cart: {}",
                    (cart.getItems() != null ? cart.getItems().size() : 0), cartId);

            if (cart.getItems() != null) {
                cart.getItems().clear();
            }

            cart.setSubtotal(BigDecimal.ZERO);
            cart.setUpdatedAt(LocalDateTime.now());
            cartRepository.save(cart);

            cartItemRepository.deleteByCartId(cartId);

            log.info("Cart cleared successfully after checkout for user: {}", user.getUsername());
        } catch (Exception e) {
            log.error("Error clearing cart after checkout: {}", e.getMessage(), e);
        }
    }


    public void validateInventoryForCheckout(Cart cart) {
        log.info("Validating inventory for checkout, cart: {}", cart.getId());

        for (CartItem item : cart.getItems()) {
            if (item.getItemType() == ItemType.product) {
                Product product = item.getProduct();
                if (product.getStockQuantity() < item.getQuantity()) {
                    log.error("Insufficient inventory for product: {}, needed: {}, available: {}",
                            product.getName(), item.getQuantity(), product.getStockQuantity());
                    throw new BadRequestException("Sản phẩm " + product.getName() +
                            " chỉ còn " + product.getStockQuantity() + " trong kho");
                }
                log.debug("Product {} has sufficient stock: {}", product.getId(), product.getStockQuantity());
            } else if (item.getItemType() == ItemType.pet) {
                Pet pet = item.getPet();
                if (pet.getStatus() != PetStatus.available) {
                    log.error("Pet is not available: {}, status: {}", pet.getName(), pet.getStatus());
                    throw new BadRequestException("Thú cưng " + pet.getName() + " đã được bán");
                }
                log.debug("Pet {} is available for sale", pet.getId());
            }
        }
        log.info("Inventory validation passed for cart: {}", cart.getId());
    }
}
