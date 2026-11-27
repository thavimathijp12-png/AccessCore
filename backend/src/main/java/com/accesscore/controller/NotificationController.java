package com.accesscore.controller;

import com.accesscore.entity.NotificationItem;
import com.accesscore.repository.NotificationItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationItemRepository notificationRepository;

    public NotificationController(NotificationItemRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public ResponseEntity<List<NotificationItem>> getNotifications() {
        return ResponseEntity.ok(notificationRepository.findAll());
    }

    @PatchMapping("/{code}/read")
    public ResponseEntity<NotificationItem> markAsRead(@PathVariable String code) {
        return notificationRepository.findByNotificationCode(code).<ResponseEntity<NotificationItem>>map((@NonNull NotificationItem notif) -> {
            notif.setUnread(false);
            NotificationItem saved = notificationRepository.save(notif);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/read-all")
    @Transactional
    public ResponseEntity<Void> markAllAsRead() {
        notificationRepository.markAllAsRead();
        return ResponseEntity.ok().build();
    }
}
