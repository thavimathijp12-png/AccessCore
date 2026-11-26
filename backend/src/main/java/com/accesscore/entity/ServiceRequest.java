package com.accesscore.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "service_requests")
public class ServiceRequest extends BaseEntity {

    @Column(name = "request_code", unique = true, nullable = false, length = 32)
    private String requestCode; // e.g. "REQ-0001"

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 100)
    private String category; // Hardware, Software, Network, etc.

    @Column(nullable = false, length = 50)
    private String priority; // Low, Medium, High, Critical

    @Column(nullable = false, length = 50)
    private String status; // New, Assigned, In Progress, On Hold, Resolved, Closed, Reopened, Rejected, Cancelled

    @Column(nullable = false, length = 100)
    private String department;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "assigned_to", length = 100)
    private String assignedTo;

    @Column(name = "created_by", nullable = false, length = 100)
    private String createdBy;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    public ServiceRequest() {
    }

    public ServiceRequest(String requestCode, String title, String category, String priority,
                          String status, String department, String description,
                          String assignedTo, String createdBy) {
        this.requestCode = requestCode;
        this.title = title;
        this.category = category;
        this.priority = priority;
        this.status = status;
        this.department = department;
        this.description = description;
        this.assignedTo = assignedTo;
        this.createdBy = createdBy;
    }

    public String getRequestCode() {
        return requestCode;
    }

    public void setRequestCode(String requestCode) {
        this.requestCode = requestCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
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

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }
}
