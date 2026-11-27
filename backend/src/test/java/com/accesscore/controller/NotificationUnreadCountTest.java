package com.accesscore.controller;

import com.accesscore.repository.NotificationItemRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationUnreadCountTest {

    @Mock
    private NotificationItemRepository notificationRepository;

    @InjectMocks
    private NotificationController controller;

    @Test
    void returnsUnreadNotificationCount() {
        when(notificationRepository.countByUnreadTrue()).thenReturn(4L);

        ResponseEntity<Map<String, Long>> response = controller.getUnreadCount();

        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("unreadCount")).isEqualTo(4L);
    }
}
