package com.accesscore.dto;

import jakarta.validation.constraints.NotBlank;

public class SwitchRoleRequest {

    @NotBlank(message = "Role is required")
    private String role;

    @NotBlank(message = "Password is required")
    private String password;

    public SwitchRoleRequest() {
    }

    public SwitchRoleRequest(String role, String password) {
        this.role = role;
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
