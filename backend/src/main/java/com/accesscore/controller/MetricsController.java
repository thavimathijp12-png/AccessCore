package com.accesscore.controller;

import com.accesscore.dto.MetricsSummaryDto;
import com.accesscore.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/metrics")
public class MetricsController {

    private final UserRepository userRepository;
    private final ServiceRequestRepository requestRepository;
    private final TaskItemRepository taskRepository;
    private final BugReportRepository bugRepository;
    private final ApprovalRepository approvalRepository;
    private final NotificationItemRepository notificationRepository;

    public MetricsController(
            UserRepository userRepository,
            ServiceRequestRepository requestRepository,
            TaskItemRepository taskRepository,
            BugReportRepository bugRepository,
            ApprovalRepository approvalRepository,
            NotificationItemRepository notificationRepository) {
        this.userRepository = userRepository;
        this.requestRepository = requestRepository;
        this.taskRepository = taskRepository;
        this.bugRepository = bugRepository;
        this.approvalRepository = approvalRepository;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    public ResponseEntity<MetricsSummaryDto> getSummary() {
        long unreadCount = notificationRepository.findByUnread(true).size();
        MetricsSummaryDto summary = new MetricsSummaryDto(
                userRepository.count(),
                requestRepository.count(),
                taskRepository.count(),
                bugRepository.count(),
                approvalRepository.count(),
                unreadCount
        );
        return ResponseEntity.ok(summary);
    }
}
