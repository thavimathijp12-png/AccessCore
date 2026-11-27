package com.accesscore.dto;

public record MetricsSummaryDto(
        long totalUsers,
        long totalRequests,
        long totalTasks,
        long totalBugs,
        long totalApprovals,
        long unreadNotifications
) {
}
