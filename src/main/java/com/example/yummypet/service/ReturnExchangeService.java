package com.example.yummypet.service;

import com.example.yummypet.dto.request.ReturnExchangeItemRequest;
import com.example.yummypet.dto.request.ReturnExchangeRequest;
import com.example.yummypet.entity.*;
import com.example.yummypet.enums.OrderStatus;
import com.example.yummypet.enums.PaymentStatus;
import com.example.yummypet.enums.ReturnStatus;
import com.example.yummypet.exception.BadRequestException;
import com.example.yummypet.exception.ResourceNotFoundException;
import com.example.yummypet.repository.ReturnExchangeItemRepository;
import com.example.yummypet.repository.ReturnExchangeRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReturnExchangeService {

    private final ReturnExchangeRepository returnExchangeRepository;
    private final ReturnExchangeItemRepository returnExchangeItemRepository;
    private final OrderService orderService;
    private final OrderItemService orderItemService;
    private final ProductStockService productStockService;
    private final CustomerService customerService;
    private final CodeGeneratorService codeGeneratorService;
    private final EntityManager entityManager;

    public Page<ReturnExchange> getAllReturnExchanges(Pageable pageable) {
        return returnExchangeRepository.findAll(pageable);
    }

    public Page<ReturnExchange> getReturnExchangesByCustomerId(Integer customerId, Pageable pageable) {
        return returnExchangeRepository.findByCustomerId(customerId, pageable);
    }

    public ReturnExchange getReturnExchangeById(Integer id) {
        return returnExchangeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đổi trả với ID: " + id));
    }

    public ReturnExchange getReturnExchangeByCode(String returnCode) {
        return returnExchangeRepository.findByReturnCode(returnCode)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đổi trả với mã: " + returnCode));
    }

    public List<ReturnExchangeItem> getReturnExchangeItems(Integer returnExchangeId) {
        return returnExchangeItemRepository.findByReturnExchangeId(returnExchangeId);
    }

    @Transactional
    public ReturnExchange createReturnExchange(ReturnExchangeRequest request) {
        Order order = orderService.getOrderById(request.getOrderId());

        if (order.getStatus() != OrderStatus.completed) {
            throw new BadRequestException("Chỉ có thể đổi trả các đơn hàng đã hoàn thành");
        }

        ReturnExchange returnExchange = new ReturnExchange();
        returnExchange.setOrder(order);

        if (request.getCustomerId() != null) {
            Customer customer = customerService.getCustomerById(request.getCustomerId());
            returnExchange.setCustomer(customer);
        } else if (order.getCustomer() != null) {
            returnExchange.setCustomer(order.getCustomer());
        }

        returnExchange.setType(request.getType());
        returnExchange.setReason(request.getReason());
        returnExchange.setNotes(request.getNotes());
        returnExchange.setStatus(ReturnStatus.pending);
        returnExchange.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        returnExchange.setReturnCode(codeGeneratorService.generateReturnCode());

        ReturnExchange savedReturnExchange = returnExchangeRepository.save(returnExchange);

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<ReturnExchangeItem> items = new ArrayList<>();

        for (ReturnExchangeItemRequest itemRequest : request.getItems()) {
            OrderItem orderItem = orderItemService.getOrderItemById(itemRequest.getOrderItemId());

            if (itemRequest.getQuantity() > orderItem.getQuantity()) {
                throw new BadRequestException("Số lượng đổi trả không thể vượt quá số lượng đã mua: " +
                        orderItem.getQuantity());
            }
            ReturnExchangeItem item = new ReturnExchangeItem();
            item.setReturnExchange(savedReturnExchange);
            item.setOrderItem(orderItem);
            item.setItemType(itemRequest.getItemType());

            switch (itemRequest.getItemType()) {
                case product:
                    item.setProduct(orderItem.getProduct());
                    break;
                case pet:
                    item.setPet(orderItem.getPet());
                    break;
                default:
                    throw new BadRequestException("Loại mục không hợp lệ");
            }

            item.setQuantity(itemRequest.getQuantity());
            item.setUnitPrice(orderItem.getUnitPrice());
            item.setTotalPrice(orderItem.getUnitPrice().multiply(new BigDecimal(itemRequest.getQuantity())));
            item.setConditionStatus(itemRequest.getConditionStatus());
            item.setNotes(itemRequest.getNotes());
            item.setCreatedAt(new Timestamp(System.currentTimeMillis()));

            ReturnExchangeItem savedItem = returnExchangeItemRepository.save(item);
            items.add(savedItem);

            totalAmount = totalAmount.add(savedItem.getTotalPrice());
        }

        savedReturnExchange.setTotalAmount(totalAmount);
        return returnExchangeRepository.save(savedReturnExchange);
    }

    @Transactional
    public ReturnExchange approveReturnExchange(Integer id, Integer processedById) {
        ReturnExchange returnExchange = getReturnExchangeById(id);

        if (returnExchange.getStatus() != ReturnStatus.pending) {
            throw new BadRequestException("Chỉ có thể phê duyệt đơn đổi trả đang ở trạng thái chờ");
        }

        List<ReturnExchangeItem> items = returnExchangeItemRepository.findByReturnExchange(returnExchange);
        if (items.isEmpty()) {
            throw new BadRequestException("Đơn đổi trả không có mục nào");
        }

        for (ReturnExchangeItem item : items) {
            if (item.getItemType() == com.example.yummypet.enums.ItemType.product && item.getProduct() != null) {
                productStockService.increaseStock(item.getProduct().getId(), item.getQuantity());
            }
        }

        returnExchange.setStatus(ReturnStatus.approved);
        returnExchange.setProcessedAt(new Timestamp(System.currentTimeMillis()));

        if (processedById != null) {
            User processedBy = entityManager.getReference(User.class, processedById);
            returnExchange.setProcessedBy(processedBy);
        }

        return returnExchangeRepository.save(returnExchange);
    }

    @Transactional
    public ReturnExchange completeReturnExchange(Integer id, BigDecimal refundAmount) {
        ReturnExchange returnExchange = getReturnExchangeById(id);

        if (returnExchange.getStatus() != ReturnStatus.approved) {
            throw new BadRequestException("Chỉ có thể hoàn thành đơn đổi trả đã được phê duyệt");
        }

        returnExchange.setRefundAmount(refundAmount);
        returnExchange.setStatus(ReturnStatus.completed);
        returnExchange.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

        return returnExchangeRepository.save(returnExchange);
    }

    @Transactional
    public ReturnExchange rejectReturnExchange(Integer id, String reason, Integer processedById) {
        ReturnExchange returnExchange = getReturnExchangeById(id);

        if (returnExchange.getStatus() != ReturnStatus.pending) {
            throw new BadRequestException("Chỉ có thể từ chối đơn đổi trả đang ở trạng thái chờ");
        }

        returnExchange.setStatus(ReturnStatus.rejected);
        returnExchange.setNotes((returnExchange.getNotes() != null ? returnExchange.getNotes() + ". " : "") +
                "Lý do từ chối: " + reason);
        returnExchange.setProcessedAt(new Timestamp(System.currentTimeMillis()));

        if (processedById != null) {
            User processedBy = entityManager.getReference(User.class, processedById);
            returnExchange.setProcessedBy(processedBy);
        }

        return returnExchangeRepository.save(returnExchange);
    }
}