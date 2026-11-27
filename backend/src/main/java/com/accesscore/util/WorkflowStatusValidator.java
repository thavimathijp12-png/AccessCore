package com.accesscore.util;

import java.util.Set;

/**
 * Validates workflow status values and approval decisions against permitted domain states.
 */
public final class WorkflowStatusValidator {

    private static final Set<String> REQUEST_STATUSES = Set.of(
            "NEW", "ASSIGNED", "IN PROGRESS", "IN_PROGRESS", "ON HOLD", "ON_HOLD",
            "RESOLVED", "CLOSED", "REOPENED", "REJECTED", "CANCELLED"
    );

    private static final Set<String> TASK_STATUSES = Set.of(
            "TODO", "TO_DO", "TO-DO", "IN_PROGRESS", "IN PROGRESS", "REVIEW", "COMPLETED", "DONE"
    );

    private static final Set<String> BUG_STATUSES = Set.of(
            "OPEN", "ASSIGNED", "IN_PROGRESS", "IN PROGRESS", "FIXED", "VERIFIED", "CLOSED", "REOPENED"
    );

    private WorkflowStatusValidator() {
    }

    public static String validateRequestStatus(String status) {
        return validateAgainst(status, REQUEST_STATUSES, "service request status");
    }

    public static String validateTaskStatus(String status) {
        return validateAgainst(status, TASK_STATUSES, "task status");
    }

    public static String validateBugStatus(String status) {
        return validateAgainst(status, BUG_STATUSES, "bug status");
    }

    public static String validateApprovalDecision(String decision) {
        if (decision == null || decision.isBlank()) {
            throw new IllegalArgumentException("Approval decision must be APPROVED or REJECTED");
        }
        String normalized = decision.trim().toUpperCase();
        if (!"APPROVED".equals(normalized) && !"REJECTED".equals(normalized)) {
            throw new IllegalArgumentException("Invalid approval decision: '" + decision + "'. Allowed values: APPROVED, REJECTED");
        }
        return normalized;
    }

    private static String validateAgainst(String value, Set<String> allowed, String label) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Invalid " + label + ": value must not be blank");
        }
        String trimmed = value.trim();
        if (!allowed.contains(trimmed.toUpperCase())) {
            throw new IllegalArgumentException("Invalid " + label + ": '" + trimmed + "'");
        }
        return trimmed;
    }
}
