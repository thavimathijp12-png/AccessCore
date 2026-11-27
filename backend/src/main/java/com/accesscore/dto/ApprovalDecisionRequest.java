package com.accesscore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ApprovalDecisionRequest {

    @NotBlank(message = "Decision is required")
    @Pattern(regexp = "(?i)APPROVED|REJECTED", message = "Decision must be APPROVED or REJECTED")
    private String decision;

    @Size(max = 100, message = "Approver must not exceed 100 characters")
    private String approver;

    private String reason;
    private String note;

    public String getDecision() {
        return decision;
    }

    public void setDecision(String decision) {
        this.decision = decision;
    }

    public String getApprover() {
        return approver;
    }

    public void setApprover(String approver) {
        this.approver = approver;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
