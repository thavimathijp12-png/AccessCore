package com.accesscore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks", indexes = {
        @Index(name = "idx_task_status", columnList = "status"),
        @Index(name = "idx_task_priority", columnList = "priority"),
        @Index(name = "idx_task_assignee", columnList = "assignee"),
        @Index(name = "idx_task_department", columnList = "department")
})
public class TaskItem extends BaseEntity {

    @Column(name = "task_code", unique = true, nullable = false, length = 32)
    private String taskCode; // e.g. "TSK-1001"

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String status; // Permitted workflow column states: To-Do, In Progress, Review, Completed

    @Column(nullable = false, length = 50)
    private String priority; // Low, Medium, High, Urgent

    @Column(length = 100)
    private String assignee;

    @Column(length = 100)
    private String reporter;

    @Column(length = 100)
    private String department;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    public TaskItem() {
    }

    public TaskItem(String taskCode, String title, String description, String status,
                    String priority, String assignee, String reporter, String department) {
        this.taskCode = taskCode;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.assignee = assignee;
        this.reporter = reporter;
        this.department = department;
    }

    public String getTaskCode() {
        return taskCode;
    }

    public void setTaskCode(String taskCode) {
        this.taskCode = taskCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public String getReporter() {
        return reporter;
    }

    public void setReporter(String reporter) {
        this.reporter = reporter;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }
}
