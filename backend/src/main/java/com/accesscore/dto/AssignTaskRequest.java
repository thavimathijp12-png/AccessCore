package com.accesscore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AssignTaskRequest {

    @NotBlank(message = "Assignee is required")
    @Size(max = 100, message = "Assignee must not exceed 100 characters")
    private String assignee;

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }
}
