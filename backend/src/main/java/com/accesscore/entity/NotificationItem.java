package com.accesscore.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_notif_unread", columnList = "unread"),
        @Index(name = "idx_notif_category", columnList = "category")
})
public class NotificationItem extends BaseEntity {

    @Column(name = "notification_code", unique = true, nullable = false, length = 32)
    private String notificationCode; // e.g. "NOT-001"

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(nullable = false, length = 50)
    private String category; // Request, Task, Bug, Approval, System

    @Column(nullable = false)
    private boolean unread = true;

    @Column(length = 255)
    private String link;

    @Column(length = 50)
    private String priority = "Medium";

    public NotificationItem() {
    }

    public NotificationItem(String notificationCode, String title, String message,
                            String category, boolean unread, String link, String priority) {
        this.notificationCode = notificationCode;
        this.title = title;
        this.message = message;
        this.category = category;
        this.unread = unread;
        this.link = link;
        this.priority = priority;
    }

    public String getNotificationCode() {
        return notificationCode;
    }

    public void setNotificationCode(String notificationCode) {
        this.notificationCode = notificationCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public boolean isUnread() {
        return unread;
    }

    public void setUnread(boolean unread) {
        this.unread = unread;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
}
