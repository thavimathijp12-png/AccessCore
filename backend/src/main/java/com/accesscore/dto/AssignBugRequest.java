package com.accesscore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AssignBugRequest {

    @NotBlank(message = "Assignee is required")
    @Size(max = 100, message = "Assignee must not exceed 100 characters")
    private String assignedTo;

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }
}
