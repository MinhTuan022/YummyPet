package com.example.yummypet.controller;

import com.example.yummypet.config.UserDetailsImpl;
import com.example.yummypet.dto.request.ReturnExchangeRequest;
import com.example.yummypet.dto.response.ApiResponse;
import com.example.yummypet.dto.response.ReturnExchangeDTO;
import com.example.yummypet.entity.Customer;
import com.example.yummypet.entity.ReturnExchange;
import com.example.yummypet.entity.ReturnExchangeItem;
import com.example.yummypet.entity.User;
import com.example.yummypet.exception.AccessDeniedException;
import com.example.yummypet.repository.CustomerRepository;
import com.example.yummypet.repository.ReturnExchangeItemRepository;
import com.example.yummypet.service.ReturnExchangeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/returns")
@RequiredArgsConstructor
@Slf4j
public class ReturnExchangeController {
    private final ReturnExchangeService returnExchangeService;
    private final ReturnExchangeItemRepository returnExchangeItemRepository;
    private final CustomerRepository customerRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ReturnExchangeDTO>>> getAllReturnExchanges(Pageable pageable) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("admin"));
        boolean isStaff = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("staff"));

        Page<ReturnExchange> returnExchanges;

        if (!isAdmin && !isStaff) {
            Integer customerId = null;
            if (currentUser != null) {
                var customerOpt = customerRepository.findByUser(currentUser);
                if (customerOpt.isPresent()) {
                    customerId = customerOpt.get().getId();
                    returnExchanges = returnExchangeService.getReturnExchangesByCustomerId(customerId, pageable);
                } else {
                    return ResponseEntity.ok(
                            new ApiResponse<>(true, "Danh sách đơn đổi trả trống", Page.empty()));
                }
            } else {
                return ResponseEntity.ok(
                        new ApiResponse<>(true, "Danh sách đơn đổi trả trống", Page.empty()));
            }
        } else {
            returnExchanges = returnExchangeService.getAllReturnExchanges(pageable);
        }

        List<ReturnExchangeDTO> returnExchangeDTOs = returnExchanges.stream()
                .map(returnExchange -> {
                    List<ReturnExchangeItem> items = returnExchangeItemRepository
                            .findByReturnExchangeId(returnExchange.getId());
                    return ReturnExchangeDTO.fromEntityWithItems(returnExchange, items);
                })
                .collect(Collectors.toList());

        Page<ReturnExchangeDTO> returnExchangeDTOPage = new PageImpl<>(
                returnExchangeDTOs, pageable, returnExchanges.getTotalElements());

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Danh sách đơn đổi trả", returnExchangeDTOPage));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReturnExchangeDTO>> getReturnExchangeById(@PathVariable Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("admin"));
        boolean isStaff = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("staff"));

        ReturnExchange returnExchange = returnExchangeService.getReturnExchangeById(id);

        if (!isAdmin && !isStaff) {
            Integer authenticatedCustomerId = null;
            if (currentUser != null) {
                var customerOpt = customerRepository.findByUser(currentUser);
                if (customerOpt.isPresent()) {
                    authenticatedCustomerId = customerOpt.get().getId();
                }
            }

            if (authenticatedCustomerId == null || returnExchange.getCustomer() == null ||
                    !returnExchange.getCustomer().getId().equals(authenticatedCustomerId)) {
                log.warn("Unauthorized attempt to access return exchange. ID: {}, User ID: {}",
                        id, currentUser != null ? currentUser.getId() : "null");
                throw new AccessDeniedException("Bạn không có quyền xem đơn đổi trả này");
            }
        }

        List<ReturnExchangeItem> items = returnExchangeService.getReturnExchangeItems(id);

        ReturnExchangeDTO returnExchangeDTO = ReturnExchangeDTO.fromEntityWithItems(returnExchange, items);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Thông tin đơn đổi trả", returnExchangeDTO));
    }

    @GetMapping("/code/{returnCode}")
    public ResponseEntity<ApiResponse<ReturnExchangeDTO>> getReturnExchangeByCode(@PathVariable String returnCode) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("admin"));
        boolean isStaff = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("staff"));

        ReturnExchange returnExchange = returnExchangeService.getReturnExchangeByCode(returnCode);

        // Nếu người dùng không phải admin hoặc staff, kiểm tra xem họ có quyền xem đơn
        // này không
        if (!isAdmin && !isStaff) {
            Integer authenticatedCustomerId = null;
            if (currentUser != null) {
                var customerOpt = customerRepository.findByUser(currentUser);
                if (customerOpt.isPresent()) {
                    authenticatedCustomerId = customerOpt.get().getId();
                }
            }

            if (authenticatedCustomerId == null || returnExchange.getCustomer() == null ||
                    !returnExchange.getCustomer().getId().equals(authenticatedCustomerId)) {
                log.warn("Unauthorized attempt to access return exchange. Code: {}, User ID: {}",
                        returnCode, currentUser != null ? currentUser.getId() : "null");
                throw new AccessDeniedException("Bạn không có quyền xem đơn đổi trả này");
            }
        }

        List<ReturnExchangeItem> items = returnExchangeService.getReturnExchangeItems(returnExchange.getId());

        ReturnExchangeDTO returnExchangeDTO = ReturnExchangeDTO.fromEntityWithItems(returnExchange, items);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Thông tin đơn đổi trả", returnExchangeDTO));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReturnExchangeDTO>> createReturnExchange(
            @Valid @RequestBody ReturnExchangeRequest request) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("admin"));
        boolean isStaff = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("staff"));

        Integer authenticatedCustomerId = null;
        if (currentUser != null) {
            var customerOpt = customerRepository.findByUser(currentUser);
            if (customerOpt.isPresent()) {
                authenticatedCustomerId = customerOpt.get().getId();
            }
        }

        if (!isAdmin && !isStaff && authenticatedCustomerId != null) {
            if (request.getCustomerId() != null && !request.getCustomerId().equals(authenticatedCustomerId)) {
                log.warn("Attempted to create return with mismatched customer ID. Provided: {}, Actual: {}",
                        request.getCustomerId(), authenticatedCustomerId);
                request.setCustomerId(authenticatedCustomerId);
            }
            if (request.getCustomerId() == null) {
                request.setCustomerId(authenticatedCustomerId);
            }
        }

        ReturnExchange returnExchange = returnExchangeService.createReturnExchange(request);
        List<ReturnExchangeItem> items = returnExchangeService.getReturnExchangeItems(returnExchange.getId());

        ReturnExchangeDTO returnExchangeDTO = ReturnExchangeDTO.fromEntityWithItems(returnExchange, items);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Đơn đổi trả đã được tạo thành công", returnExchangeDTO));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<ReturnExchangeDTO>> approveReturnExchange(
            @PathVariable Integer id,
            @RequestParam(required = false) Integer processedById) {

        // Kiểm tra quyền admin/staff
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("admin"));
        boolean isStaff = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("staff"));

        if (!isAdmin && !isStaff) {
            log.warn("Unauthorized attempt to approve return exchange. ID: {}", id);
            throw new AccessDeniedException("Chỉ admin hoặc nhân viên mới có quyền phê duyệt đơn đổi trả");
        }

        if (processedById == null) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User currentUser = userDetails.getUser();
            if (currentUser != null) {
                processedById = currentUser.getId();
            }
        }

        ReturnExchange returnExchange = returnExchangeService.approveReturnExchange(id, processedById);
        List<ReturnExchangeItem> items = returnExchangeService.getReturnExchangeItems(id);

        ReturnExchangeDTO returnExchangeDTO = ReturnExchangeDTO.fromEntityWithItems(returnExchange, items);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Đơn đổi trả đã được phê duyệt", returnExchangeDTO));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<ReturnExchangeDTO>> completeReturnExchange(
            @PathVariable Integer id,
            @RequestParam BigDecimal refundAmount) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("admin"));
        boolean isStaff = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("staff"));

        if (!isAdmin && !isStaff) {
            log.warn("Unauthorized attempt to complete return exchange. ID: {}", id);
            throw new AccessDeniedException("Chỉ admin hoặc nhân viên mới có quyền hoàn thành đơn đổi trả");
        }

        ReturnExchange returnExchange = returnExchangeService.completeReturnExchange(id, refundAmount);
        List<ReturnExchangeItem> items = returnExchangeService.getReturnExchangeItems(id);

        ReturnExchangeDTO returnExchangeDTO = ReturnExchangeDTO.fromEntityWithItems(returnExchange, items);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Đơn đổi trả đã được hoàn thành", returnExchangeDTO));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<ReturnExchangeDTO>> rejectReturnExchange(
            @PathVariable Integer id,
            @RequestParam String reason,
            @RequestParam(required = false) Integer processedById) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("admin"));
        boolean isStaff = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("staff"));

        if (!isAdmin && !isStaff) {
            log.warn("Unauthorized attempt to reject return exchange. ID: {}", id);
            throw new AccessDeniedException("Chỉ admin hoặc nhân viên mới có quyền từ chối đơn đổi trả");
        }

        if (processedById == null) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User currentUser = userDetails.getUser();
            if (currentUser != null) {
                processedById = currentUser.getId();
            }
        }

        ReturnExchange returnExchange = returnExchangeService.rejectReturnExchange(id, reason, processedById);
        List<ReturnExchangeItem> items = returnExchangeService.getReturnExchangeItems(id);

        ReturnExchangeDTO returnExchangeDTO = ReturnExchangeDTO.fromEntityWithItems(returnExchange, items);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Đơn đổi trả đã bị từ chối", returnExchangeDTO));
    }
}
