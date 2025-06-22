package com.example.yummypet.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceStatisticsDTO {
    private Integer serviceId;
    private String serviceName;
    private Long totalBookings;
    private Long completedBookings;
    private Long cancelledBookings;
    private Double completionRate; // Tỷ lệ hoàn thành
    private Integer totalServices; 
}
