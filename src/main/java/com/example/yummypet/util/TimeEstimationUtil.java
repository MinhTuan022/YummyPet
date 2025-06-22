package com.example.yummypet.util;

import java.time.Duration;
import java.time.LocalDateTime;


public class TimeEstimationUtil {


    public static String getTimeRemaining(LocalDateTime completionTime) {
        if (completionTime == null) {
            return "Không có ước tính";
        }
        
        LocalDateTime now = LocalDateTime.now();
        
        if (now.isAfter(completionTime)) {
            Duration overdue = Duration.between(completionTime, now);
            long minutes = overdue.toMinutes();
            
            if (minutes < 60) {
                return String.format("Trễ %d phút", minutes);
            } else {
                long hours = minutes / 60;
                long remainingMinutes = minutes % 60;
                return String.format("Trễ %d giờ %d phút", hours, remainingMinutes);
            }
        } 
        else {
            Duration remaining = Duration.between(now, completionTime);
            long minutes = remaining.toMinutes();
            
            if (minutes < 60) {
                return String.format("Còn %d phút", minutes);
            } else {
                long hours = minutes / 60;
                long remainingMinutes = minutes % 60;
                return String.format("Còn %d giờ %d phút", hours, remainingMinutes);
            }
        }
    }
    

    public static LocalDateTime estimateCompletionTime(LocalDateTime startTime, Integer durationMinutes) {
        if (startTime == null) {
            startTime = LocalDateTime.now();
        }
        
        if (durationMinutes == null || durationMinutes <= 0) {
            durationMinutes = 60; 
        }
        
        return startTime.plusMinutes(durationMinutes);
    }
}
