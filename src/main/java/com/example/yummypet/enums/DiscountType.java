package com.example.yummypet.enums;

public enum DiscountType {
    PERCENTAGE("Phần trăm"),
    FIXED_AMOUNT("Số tiền cố định");

    private final String description;

    DiscountType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}