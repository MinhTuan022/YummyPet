package com.example.yummypet.enums;

public enum OrderType {
    ONLINE("Online"),
    IN_STORE("Tại cửa hàng");

    private final String description;

    OrderType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
