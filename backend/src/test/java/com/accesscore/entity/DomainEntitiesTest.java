package com.accesscore.entity;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class DomainEntitiesTest {

    @Test
    void serviceRequestAndApprovalConstructorsPopulateFields() {
        ServiceRequest req = new ServiceRequest("REQ-100", "Monitor", "Hardware",
                "Low", "New", "Engineering", "27-inch", "James Wilson", "Tara Anand");
        assertThat(req.getRequestCode()).isEqualTo("REQ-100");
        assertThat(req.getStatus()).isEqualTo("New");

        Approval apr = new Approval("APR-3100", "License", "Software",
                "James Wilson", "Engineering", "$200", "Medium", "PENDING", "Needed for sprint");
        assertThat(apr.getApprovalCode()).isEqualTo("APR-3100");
        assertThat(apr.getSubmittedDate()).isNotNull();
    }

    @Test
    void bugTaskAndNotificationEntitiesPreserveState() {
        BugReport bug = new BugReport("BUG-2100", "Crash", "Critical", "OPEN", "Production", "Mike Torres", "Elena");
        assertThat(bug.getBugCode()).isEqualTo("BUG-2100");

        TaskItem task = new TaskItem("TSK-1100", "Patch", "Apply patch", "TODO", "High", "Mike", "Tara", "Ops");
        assertThat(task.getTaskCode()).isEqualTo("TSK-1100");

        NotificationItem notif = new NotificationItem("NOT-100", "Alert", "Body", "System", true, "/dashboard", "High");
        assertThat(notif.isUnread()).isTrue();
    }
}
