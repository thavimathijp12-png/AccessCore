package com.accesscore.config;

import java.time.Instant;

public record SecurityAuditEvent(String action, String actorEmail, boolean success, String details, Instant occurredAt) {

    public static SecurityAuditEvent of(String action, String actorEmail, boolean success, String details) {
        return new SecurityAuditEvent(action, actorEmail, success, details, Instant.now());
    }
}
