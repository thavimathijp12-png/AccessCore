package com.accesscore.dto;

import jakarta.validation.constraints.Size;

public class SelfProfileUpdateRequest {

    @Size(max = 50, message = "Phone must not exceed 50 characters")
    private String phone;

    @Size(max = 150, message = "Location must not exceed 150 characters")
    private String location;

    private String bio;

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

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }
}
