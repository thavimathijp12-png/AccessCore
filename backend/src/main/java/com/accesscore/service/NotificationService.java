package com.accesscore.service;

import com.accesscore.entity.NotificationItem;
import com.accesscore.repository.NotificationItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    private final NotificationItemRepository notificationRepository;

    public NotificationService(NotificationItemRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional(readOnly = true)
    public List<NotificationItem> getAllNotifications() {
        return notificationRepository.findAll();
    }

    @Transactional
    public Optional<NotificationItem> markAsRead(String code) {
        return notificationRepository.findByNotificationCode(code).map(notif -> {
            notif.setUnread(false);
            return notificationRepository.save(notif);
        });
    }

    @Transactional
    public void markAllAsRead() {
        List<NotificationItem> list = notificationRepository.findAll();
        list.forEach(n -> n.setUnread(false));
        notificationRepository.saveAll(list);
    }
}
