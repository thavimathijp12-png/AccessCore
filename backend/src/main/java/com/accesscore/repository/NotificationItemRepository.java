package com.accesscore.repository;

import com.accesscore.entity.NotificationItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationItemRepository extends JpaRepository<NotificationItem, Long> {
    Optional<NotificationItem> findByNotificationCode(String notificationCode);
    List<NotificationItem> findByUnread(boolean unread);
    List<NotificationItem> findByCategory(String category);
    long countByUnreadTrue();
}
