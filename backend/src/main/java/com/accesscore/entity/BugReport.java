package com.accesscore.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "bugs")
public class BugReport extends BaseEntity {

    @Column(name = "bug_code", unique = true, nullable = false, length = 32)
    private String bugCode; // e.g. "BUG-2001"

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 50)
    private String severity; // Low, Medium, High, Critical

    @Column(nullable = false, length = 50)
    private String status; // OPEN, ASSIGNED, IN_PROGRESS, FIXED, VERIFIED, CLOSED

    @Column(nullable = false, length = 50)
    private String environment; // Production, Staging, QA, Development

    @Column(name = "assigned_to", length = 100)
    private String assignedTo;

    @Column(name = "reported_by", length = 100)
    private String reportedBy;

    @Column(name = "reproduction_steps", columnDefinition = "TEXT")
    private String reproductionSteps;

    @Column(name = "expected_result", columnDefinition = "TEXT")
    private String expectedResult;

    @Column(name = "actual_result", columnDefinition = "TEXT")
    private String actualResult;

    public BugReport() {
    }

    public BugReport(String bugCode, String title, String severity, String status,
                     String environment, String assignedTo, String reportedBy) {
        this.bugCode = bugCode;
        this.title = title;
        this.severity = severity;
        this.status = status;
        this.environment = environment;
        this.assignedTo = assignedTo;
        this.reportedBy = reportedBy;
    }

    public String getBugCode() {
        return bugCode;
    }

    public void setBugCode(String bugCode) {
        this.bugCode = bugCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getReportedBy() {
        return reportedBy;
    }

    public void setReportedBy(String reportedBy) {
        this.reportedBy = reportedBy;
    }

    public String getReproductionSteps() {
        return reproductionSteps;
    }

    public void setReproductionSteps(String reproductionSteps) {
        this.reproductionSteps = reproductionSteps;
    }

    public String getExpectedResult() {
        return expectedResult;
    }

    public void setExpectedResult(String expectedResult) {
        this.expectedResult = expectedResult;
    }

    public String getActualResult() {
        return actualResult;
    }

    public void setActualResult(String actualResult) {
        this.actualResult = actualResult;
    }
}
