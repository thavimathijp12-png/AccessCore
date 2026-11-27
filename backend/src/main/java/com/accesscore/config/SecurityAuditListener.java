package com.accesscore.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class SecurityAuditListener {

    private static final Logger log = LoggerFactory.getLogger(SecurityAuditListener.class);
    private final List<SecurityAuditEvent> recentEvents = new CopyOnWriteArrayList<>();

    @EventListener
    public void onSecurityAudit(SecurityAuditEvent event) {
        recentEvents.add(event);
        if (recentEvents.size() > 100) {
            recentEvents.remove(0);
        }
        log.info("AUDIT action={} actor={} success={} details={}",
                event.action(), event.actorEmail(), event.success(), event.details());
    }

    public List<SecurityAuditEvent> getRecentEvents() {
        return List.copyOf(recentEvents);
    }
}
