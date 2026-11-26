package com.accesscore.dto;

import com.accesscore.entity.User;

public class UserDto {
    private String id; // userCode, e.g. "USR-001"
    private String name;
    private String email;
    private String role;
    private String department;
    private String title;
    private String phone;
    private String location;
    private String status;
    private String bio;

    public UserDto() {
    }

    public static UserDto fromEntity(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getUserCode());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().getDisplayName());
        dto.setDepartment(user.getDepartment());
        dto.setTitle(user.getTitle());
        dto.setPhone(user.getPhone());
        dto.setLocation(user.getLocation());
        dto.setStatus(user.getStatus());
        dto.setBio(user.getBio());
        return dto;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }
}
