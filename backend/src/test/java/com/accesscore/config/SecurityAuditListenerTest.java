package com.accesscore.config;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SecurityAuditListenerTest {

    @Test
    void recordsAndCapsRecentAuditEvents() {
        SecurityAuditListener listener = new SecurityAuditListener();
        SecurityAuditEvent event = SecurityAuditEvent.of("LOGIN", "tara.anand@accesscore.io", true, "JWT issued");

        listener.onSecurityAudit(event);

        assertThat(listener.getRecentEvents()).hasSize(1);
        assertThat(listener.getRecentEvents().get(0).action()).isEqualTo("LOGIN");
    }
}
