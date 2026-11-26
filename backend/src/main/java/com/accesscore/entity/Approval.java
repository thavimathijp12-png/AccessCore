package com.accesscore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "approvals")
public class Approval extends BaseEntity {

    @Column(name = "approval_code", unique = true, nullable = false, length = 32)
    private String approvalCode; // e.g. "APR-3001"

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 100)
    private String type; // Equipment & Hardware, Software License, Privileged Access, etc.

    @Column(nullable = false, length = 100)
    private String requestor;

    @Column(nullable = false, length = 100)
    private String department;

    @Column(name = "amount_or_details", length = 255)
    private String amountOrDetails;

    @Column(nullable = false, length = 50)
    private String priority; // Low, Medium, High, Critical

    @Column(nullable = false, length = 50)
    private String status; // PENDING, APPROVED, REJECTED

    @Column(columnDefinition = "TEXT")
    private String justification;

    @Column(name = "submitted_date")
    private LocalDateTime submittedDate;

    @Column(name = "decision_date")
    private LocalDateTime decisionDate;

    @Column(length = 100)
    private String approver;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    public Approval() {
    }

    public Approval(String approvalCode, String title, String type, String requestor,
                    String department, String amountOrDetails, String priority,
                    String status, String justification) {
        this.approvalCode = approvalCode;
        this.title = title;
        this.type = type;
        this.requestor = requestor;
        this.department = department;
        this.amountOrDetails = amountOrDetails;
        this.priority = priority;
        this.status = status;
        this.justification = justification;
        this.submittedDate = LocalDateTime.now();
    }

    public String getApprovalCode() {
        return approvalCode;
    }

    public void setApprovalCode(String approvalCode) {
        this.approvalCode = approvalCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getRequestor() {
        return requestor;
    }

    public void setRequestor(String requestor) {
        this.requestor = requestor;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getAmountOrDetails() {
        return amountOrDetails;
    }

    public void setAmountOrDetails(String amountOrDetails) {
        this.amountOrDetails = amountOrDetails;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getJustification() {
        return justification;
    }

    public void setJustification(String justification) {
        this.justification = justification;
    }

    public LocalDateTime getSubmittedDate() {
        return submittedDate;
    }

    public void setSubmittedDate(LocalDateTime submittedDate) {
        this.submittedDate = submittedDate;
    }

    public LocalDateTime getDecisionDate() {
        return decisionDate;
    }

    public void setDecisionDate(LocalDateTime decisionDate) {
        this.decisionDate = decisionDate;
    }

    public String getApprover() {
        return approver;
    }

    public void setApprover(String approver) {
        this.approver = approver;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}
