package com.accesscore.controller;

import com.accesscore.dto.MetricsSummaryDto;
import com.accesscore.entity.NotificationItem;
import com.accesscore.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MetricsControllerTest {

    @Mock private UserRepository userRepository;
    @Mock private ServiceRequestRepository requestRepository;
    @Mock private TaskItemRepository taskRepository;
    @Mock private BugReportRepository bugRepository;
    @Mock private ApprovalRepository approvalRepository;
    @Mock private NotificationItemRepository notificationRepository;

    @InjectMocks
    private MetricsController metricsController;

    @Test
    void returnsAggregatedEntityCounts() {
        when(userRepository.count()).thenReturn(5L);
        when(requestRepository.count()).thenReturn(3L);
        when(taskRepository.count()).thenReturn(4L);
        when(bugRepository.count()).thenReturn(2L);
        when(approvalRepository.count()).thenReturn(1L);
        when(notificationRepository.findByUnread(true)).thenReturn(List.of(new NotificationItem()));

        ResponseEntity<MetricsSummaryDto> response = metricsController.getSummary();

        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().totalUsers()).isEqualTo(5L);
        assertThat(response.getBody().unreadNotifications()).isEqualTo(1L);
    }
}
