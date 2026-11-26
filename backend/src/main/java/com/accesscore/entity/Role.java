package com.accesscore.entity;

public enum Role {
    ADMIN("Admin"),
    TEAM_LEAD("Team Lead"),
    EMPLOYEE("Employee");

    private final String displayName;

    Role(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static Role fromString(String text) {
        for (Role r : Role.values()) {
            if (r.name().equalsIgnoreCase(text) || r.displayName.equalsIgnoreCase(text)) {
                return r;
            }
        }
        return EMPLOYEE;
    }
}
