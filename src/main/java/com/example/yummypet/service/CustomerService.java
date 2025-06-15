package com.example.yummypet.service;

import com.example.yummypet.dto.response.customer.CustomerDTO;
import com.example.yummypet.dto.response.customer.CustomerDetailDTO;
import com.example.yummypet.dto.response.customer.CustomerPetSummaryDTO;
import com.example.yummypet.dto.response.loyalty.LoyaltyPointHistoryDTO;
import com.example.yummypet.dto.response.order.OrderSummaryDTO;
import com.example.yummypet.dto.response.serviceOrder.ServiceOrderSummaryDTO;
import com.example.yummypet.entity.Customer;
import com.example.yummypet.repository.CustomerRepository;
import com.example.yummypet.specification.CustomerMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;


    @Transactional(readOnly = true)
    public List<CustomerDTO> getAllCustomers() {
        log.info("Fetching all active customers");
        List<Customer> customers = customerRepository.findAll();
        return customers.stream()
                .map(customerMapper::toDTO)
                .collect(Collectors.toList());
    }


    @Transactional(readOnly = true)
    public Page<CustomerDTO> getAllCustomers(Pageable pageable) {
        log.info("Fetching all active customers with pagination: {}", pageable);
        Page<Customer> customers = customerRepository.findByIsActiveTrue(pageable);
        return customers.map(customerMapper::toDTO);
    }


    @Transactional(readOnly = true)
    public List<CustomerDetailDTO> getAllCustomersWithDetails() {
        log.info("Fetching all active customers with full details");

        List<Customer> customers = customerRepository.findAllActiveWithPets();

        Map<Integer, Customer> customerMap = customers.stream()
                .collect(Collectors.toMap(Customer::getId, customer -> customer));

        customerMap.keySet().forEach(customerId -> {
            customerRepository.findByIdWithOrders(customerId)
                    .ifPresent(customerWithOrders -> {
                        Customer customer = customerMap.get(customerId);
                        customer.setOrders(customerWithOrders.getOrders());
                    });
        });

        customerMap.keySet().forEach(customerId -> {
            customerRepository.findByIdWithServiceOrders(customerId)
                    .ifPresent(customerWithServiceOrders -> {
                        Customer customer = customerMap.get(customerId);
                        customer.setServiceOrders(customerWithServiceOrders.getServiceOrders());
                    });
        });

        // Fetch loyalty history cho từng customer
        customerMap.keySet().forEach(customerId -> {
            customerRepository.findByIdWithLoyaltyHistory(customerId)
                    .ifPresent(customerWithLoyalty -> {
                        Customer customer = customerMap.get(customerId);
                        customer.setLoyaltyPointHistory(customerWithLoyalty.getLoyaltyPointHistory());
                    });
        });

        return customers.stream()
                .map(customerMapper::toDetailDTO)
                .collect(Collectors.toList());
    }


    @Transactional(readOnly = true)
    public Optional<CustomerDetailDTO> getCustomerWithDetails(Integer customerId) {
        log.info("Fetching customer details for ID: {}", customerId);

        Optional<Customer> customerOpt = customerRepository.findByIdWithPets(customerId);

        if (customerOpt.isEmpty()) {
            return Optional.empty();
        }

        Customer customer = customerOpt.get();

        customerRepository.findByIdWithOrders(customerId)
                .ifPresent(customerWithOrders -> {
                    customer.setOrders(customerWithOrders.getOrders());
                });

        customerRepository.findByIdWithServiceOrders(customerId)
                .ifPresent(customerWithServiceOrders -> {
                    customer.setServiceOrders(customerWithServiceOrders.getServiceOrders());
                });

        customerRepository.findByIdWithLoyaltyHistory(customerId)
                .ifPresent(customerWithLoyalty -> {
                    customer.setLoyaltyPointHistory(customerWithLoyalty.getLoyaltyPointHistory());
                });

        return Optional.of(customerMapper.toDetailDTO(customer));
    }


    @Transactional(readOnly = true)
    public Optional<CustomerDetailDTO> getCustomerWithDetailsOptimized(Integer customerId) {
        log.info("Fetching customer details (optimized) for ID: {}", customerId);

        // Lấy thông tin cơ bản của customer
        Optional<Customer> customerOpt = customerRepository.findById(customerId);

        if (customerOpt.isEmpty() || !customerOpt.get().getIsActive()) {
            return Optional.empty();
        }

        Customer customer = customerOpt.get();

        CustomerDetailDTO dto = new CustomerDetailDTO();
        dto.setId(customer.getId());
        dto.setCustomerCode(customer.getCustomerCode());
        dto.setFullName(customer.getFullName());
        dto.setUsername(customer.getUsername());
        dto.setPhone(customer.getPhone());
        dto.setEmail(customer.getEmail());
        dto.setAddress(customer.getAddress());
        dto.setGender(customer.getGender());
        dto.setDateOfBirth(customer.getDateOfBirth());
        dto.setLoyaltyPoints(customer.getLoyaltyPoints());
        dto.setIsActive(customer.getIsActive());
        dto.setCreatedAt(customer.getCreatedAt());
        dto.setUpdatedAt(customer.getUpdatedAt());

        fetchCustomerPets(customerId, dto);
        fetchCustomerOrders(customerId, dto);
        fetchCustomerServiceOrders(customerId, dto);
        fetchCustomerLoyaltyHistory(customerId, dto);

        return Optional.of(dto);
    }

    private void fetchCustomerPets(Integer customerId, CustomerDetailDTO dto) {
        try {
            customerRepository.findByIdWithPets(customerId)
                    .ifPresent(customerWithPets -> {
                        if (customerWithPets.getPets() != null) {
                            dto.setPets(customerWithPets.getPets().stream()
                                    .map(this::toPetSummaryDTO)
                                    .collect(Collectors.toList()));
                        }
                    });
        } catch (Exception e) {
            log.warn("Error fetching pets for customer {}: {}", customerId, e.getMessage());
            dto.setPets(new ArrayList<>());
        }
    }

    private void fetchCustomerOrders(Integer customerId, CustomerDetailDTO dto) {
        try {
            customerRepository.findByIdWithOrders(customerId)
                    .ifPresent(customerWithOrders -> {
                        if (customerWithOrders.getOrders() != null) {
                            dto.setRecentOrders(customerWithOrders.getOrders().stream()
                                    .limit(5)
                                    .map(this::toOrderSummaryDTO)
                                    .collect(Collectors.toList()));
                        }
                    });
        } catch (Exception e) {
            log.warn("Error fetching orders for customer {}: {}", customerId, e.getMessage());
            dto.setRecentOrders(new ArrayList<>());
        }
    }

    private void fetchCustomerServiceOrders(Integer customerId, CustomerDetailDTO dto) {
        try {
            customerRepository.findByIdWithServiceOrders(customerId)
                    .ifPresent(customerWithServiceOrders -> {
                        if (customerWithServiceOrders.getServiceOrders() != null) {
                            dto.setRecentServiceOrders(customerWithServiceOrders.getServiceOrders().stream()
                                    .limit(5)
                                    .map(this::toServiceOrderSummaryDTO)
                                    .collect(Collectors.toList()));
                        }
                    });
        } catch (Exception e) {
            log.warn("Error fetching service orders for customer {}: {}", customerId, e.getMessage());
            dto.setRecentServiceOrders(new ArrayList<>());
        }
    }

    private void fetchCustomerLoyaltyHistory(Integer customerId, CustomerDetailDTO dto) {
        try {
            customerRepository.findByIdWithLoyaltyHistory(customerId)
                    .ifPresent(customerWithLoyalty -> {
                        if (customerWithLoyalty.getLoyaltyPointHistory() != null) {
                            dto.setLoyaltyHistory(customerWithLoyalty.getLoyaltyPointHistory().stream()
                                    .limit(10)
                                    .map(this::toLoyaltyHistoryDTO)
                                    .collect(Collectors.toList()));
                        }
                    });
        } catch (Exception e) {
            log.warn("Error fetching loyalty history for customer {}: {}", customerId, e.getMessage());
            dto.setLoyaltyHistory(new ArrayList<>());
        }
    }
    public boolean softDeleteCustomer(Integer customerId) {
        log.info("Performing soft delete for customer ID: {}", customerId);

        Optional<Customer> customerOpt = customerRepository.findById(customerId);
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            if (!customer.getIsActive()) {
                log.warn("Customer ID {} is already inactive", customerId);
                return false;
            }

            customer.setIsActive(false);
            customerRepository.save(customer);
            log.info("Successfully soft deleted customer ID: {}", customerId);
            return true;
        }

        log.warn("Customer not found for ID: {}", customerId);
        return false;
    }


    public boolean hardDeleteCustomer(Integer customerId) {
        log.info("Performing hard delete for customer ID: {}", customerId);

        if (customerRepository.existsById(customerId)) {
            try {
                customerRepository.deleteById(customerId);
                log.info("Successfully hard deleted customer ID: {}", customerId);
                return true;
            } catch (Exception e) {
                log.error("Error during hard delete for customer ID {}: {}", customerId, e.getMessage());
                throw new RuntimeException("Cannot delete customer due to existing relationships", e);
            }
        }

        log.warn("Customer not found for ID: {}", customerId);
        return false;
    }


    public boolean restoreCustomer(Integer customerId) {
        log.info("Restoring customer ID: {}", customerId);

        Optional<Customer> customerOpt = customerRepository.findById(customerId);
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            if (customer.getIsActive()) {
                log.warn("Customer ID {} is already active", customerId);
                return false;
            }

            customer.setIsActive(true);
            customerRepository.save(customer);
            log.info("Successfully restored customer ID: {}", customerId);
            return true;
        }

        log.warn("Customer not found for ID: {}", customerId);
        return false;
    }

    private CustomerPetSummaryDTO toPetSummaryDTO(com.example.yummypet.entity.CustomerPet pet) {
        CustomerPetSummaryDTO dto = new CustomerPetSummaryDTO();
        dto.setId(pet.getId());
        dto.setBreed(pet.getBreed());
        dto.setGender(pet.getGender() != null ? pet.getGender().toString() : null);
        dto.setAge(pet.getAgeMonths());
        dto.setWeight(pet.getWeight());
        dto.setSpecialNotes(pet.getSpecialNotes());
        return dto;
    }

    private OrderSummaryDTO toOrderSummaryDTO(com.example.yummypet.entity.Order order) {
        OrderSummaryDTO dto = new OrderSummaryDTO();
        dto.setId(order.getId());
        dto.setCreatedAt(order.getCreatedAt());
//        dto.setDeliveryMethod(order.getDeliveryMethod() != null ? order.getDeliveryMethod().toString() : null);
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus() != null ? order.getStatus().toString() : null);
        try {
            dto.setTotalItems(order.getOrderItems() != null ? order.getOrderItems().size() : 0);
        } catch (Exception e) {
            dto.setTotalItems(0);
        }
        return dto;
    }

    private ServiceOrderSummaryDTO toServiceOrderSummaryDTO(com.example.yummypet.entity.ServiceOrder serviceOrder) {
        ServiceOrderSummaryDTO dto = new ServiceOrderSummaryDTO();
        dto.setId(serviceOrder.getId());
        dto.setCreatedAt(serviceOrder.getCreatedAt());
        dto.setTotalAmount(serviceOrder.getTotalAmount());
        dto.setStatus(serviceOrder.getStatus() != null ? serviceOrder.getStatus().toString() : null);
        dto.setPaymentMethod(serviceOrder.getPaymentMethod() != null ? serviceOrder.getPaymentMethod().toString() : null);
        return dto;
    }

    private LoyaltyPointHistoryDTO toLoyaltyHistoryDTO(com.example.yummypet.entity.LoyaltyPointHistory history) {
        LoyaltyPointHistoryDTO dto = new LoyaltyPointHistoryDTO();
        dto.setId(history.getId());
        dto.setCreatedAt(history.getCreatedAt());
        dto.setDescription(history.getDescription());
        dto.setPointsEarned(history.getPointsEarned());
        dto.setPointsUsed(history.getPointsUsed());
        return dto;
    }
}