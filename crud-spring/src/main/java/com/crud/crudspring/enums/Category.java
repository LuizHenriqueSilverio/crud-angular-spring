package com.crud.crudspring.enums;

public enum Category {
    BACK_END("Backend"), FRONT_END("Frontend"), FULL_STACK("FullStack");

    private String value;

    private Category(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return this.getValue();
    }
}
