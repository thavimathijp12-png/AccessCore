package com.accesscore.config;

import com.accesscore.entity.*;
import com.accesscore.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
public class DatabaseSeeder {

    @Bean
    public CommandLineRunner initDatabase(
            UserRepository userRepository,
            ServiceRequestRepository requestRepository,
            TaskItemRepository taskRepository,
            BugReportRepository bugRepository,
            ApprovalRepository approvalRepository,
            NotificationItemRepository notificationRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed Users if empty
            if (userRepository.count() == 0) {
                User admin = new User("USR-001", "Tara Anand", "tara.anand@accesscore.io",
                        passwordEncoder.encode("admin123"), Role.ADMIN, "Engineering", "Senior Systems Architect & Admin");
                admin.setPhone("+1 (555) 234-5678");
                admin.setLocation("San Francisco, CA (HQ)");
                admin.setBio("Lead architect managing corporate infrastructure, Okta identity federation, and global access governance.");

                User lead = new User("USR-002", "Sarah Chen", "sarah.chen@accesscore.io",
                        passwordEncoder.encode("lead123"), Role.TEAM_LEAD, "Operations", "Director of Service Operations");
                lead.setPhone("+1 (555) 345-6789");
                lead.setLocation("New York, NY");
                lead.setBio("Oversees workplace technology, device fleet configuration via Jamf, and SaaS licensing portfolio.");

                User emp = new User("USR-003", "James Wilson", "james.wilson@accesscore.io",
                        passwordEncoder.encode("emp123"), Role.EMPLOYEE, "Engineering", "DevOps & Reliability Engineer");
                emp.setPhone("+1 (555) 456-7890");
                emp.setLocation("Austin, TX");
                emp.setBio("Focuses on database performance tuning, CI/CD pipeline security, and infrastructure reliability.");

                User emp2 = new User("USR-004", "Mike Torres", "mike.torres@accesscore.io",
                        passwordEncoder.encode("emp123"), Role.EMPLOYEE, "Operations", "Network & Security Specialist");
                emp2.setPhone("+1 (555) 567-8901");
                emp2.setLocation("Seattle, WA");
                emp2.setBio("Maintains corporate SD-WAN networks, multi-site VPN tunnels, and perimeter security telemetry.");

                User lead2 = new User("USR-005", "Elena Rostova", "elena.rostova@accesscore.io",
                        passwordEncoder.encode("lead123"), Role.TEAM_LEAD, "Security & Compliance", "Lead Compliance Auditor");
                lead2.setPhone("+1 (555) 678-9012");
                lead2.setLocation("Chicago, IL");
                lead2.setBio("Oversees internal controls, external SOC2 audits, and vulnerability mitigation lifecycles.");

                userRepository.save(admin);
                userRepository.save(lead);
                userRepository.save(emp);
                userRepository.save(emp2);
                userRepository.save(lead2);
            }

            // Seed Requests if empty
            if (requestRepository.count() == 0) {
                requestRepository.save(new ServiceRequest("REQ-0001", "New MacBook Pro for Engineering Lead", "Hardware",
                        "High", "In Progress", "Engineering",
                        "Requesting a new MacBook Pro 14\" M3 Pro for the new engineering lead who joins next Monday. Required specs: 18GB RAM, 512GB SSD.",
                        "James Wilson", "Tara Anand"));

                requestRepository.save(new ServiceRequest("REQ-0002", "Adobe Creative Cloud license renewal", "Software",
                        "Medium", "Assigned", "Marketing",
                        "Annual renewal of Creative Cloud licenses for design and video teams (12 seats total).",
                        "Sarah Chen", "Elena Rostova"));

                requestRepository.save(new ServiceRequest("REQ-0003", "VPN access for remote contractor in EMEA", "Access & Permissions",
                        "Critical", "New", "Engineering",
                        "Need full EMEA development VPC access for frontend contractor via Pritunl Zero-Trust VPN.",
                        "Mike Torres", "James Wilson"));
            }

            // Seed Tasks if empty
            if (taskRepository.count() == 0) {
                TaskItem t1 = new TaskItem("TSK-1001", "Implement Multi-Factor Authentication (MFA) Enforcement",
                        "Configure corporate Okta policies to require TOTP / FIDO2 security keys for all enterprise admin accounts.",
                        "IN_PROGRESS", "Urgent", "James Wilson", "Tara Anand", "Engineering");
                t1.setDueDate(LocalDateTime.now().plusDays(2));

                TaskItem t2 = new TaskItem("TSK-1002", "Migrate legacy LDAP directory to Azure AD SCIM",
                        "Transition on-prem active directory synchronization to modern SCIM automated user provisioning.",
                        "TODO", "High", "Mike Torres", "Tara Anand", "Engineering");
                t2.setDueDate(LocalDateTime.now().plusDays(7));

                TaskItem t3 = new TaskItem("TSK-1003", "Quarterly SOC2 Type II compliance evidence collection",
                        "Gather access log exports, role change audit tickets, and firewall penetration test certificates for external auditors.",
                        "REVIEW", "High", "Sarah Chen", "Elena Rostova", "Operations");
                t3.setDueDate(LocalDateTime.now().plusDays(1));

                taskRepository.save(t1);
                taskRepository.save(t2);
                taskRepository.save(t3);
            }

            // Seed Bugs if empty
            if (bugRepository.count() == 0) {
                bugRepository.save(new BugReport("BUG-2001", "SAML token signature validation fails intermittent during IdP failover",
                        "Critical", "IN_PROGRESS", "Production", "Mike Torres", "Elena Rostova"));
                bugRepository.save(new BugReport("BUG-2002", "Export to CSV on Reports page truncated at 1000 records",
                        "Medium", "FIXED", "Staging", "James Wilson", "Tara Anand"));
                bugRepository.save(new BugReport("BUG-2003", "Role permission modal does not save custom API scope checkboxes",
                        "High", "ASSIGNED", "QA", "Sarah Chen", "James Wilson"));
            }

            // Seed Approvals if empty
            if (approvalRepository.count() == 0) {
                approvalRepository.save(new Approval("APR-3001", "AWS Production IAM Administrator Role Access",
                        "Privileged Access", "James Wilson", "Engineering", "Role: ProductionOpsAdmin (Time-bound 48 hours)",
                        "Critical", "PENDING", "Required for scheduled PostgreSQL cluster maintenance and failover rehearsal during this weekend maintenance window."));

                approvalRepository.save(new Approval("APR-3002", "Datadog Enterprise APM Subscription Extension",
                        "Software License", "Sarah Chen", "Engineering", "$4,200 / month (Annual contract addendum)",
                        "High", "PENDING", "Current host count exceeded by 35 nodes following Kubernetes microservice cluster expansion. Additional synthetic monitoring licenses needed."));

                Approval app3 = new Approval("APR-3003", "Ergonomic Standing Desk & Monitor Arm Package",
                        "Equipment & Hardware", "Tom Nguyen", "Sales", "$850.00 (Standard Ergonomic Allowance)",
                        "Medium", "APPROVED", "Occupational health recommendation for ergonomic sit-stand desk setup. Documentation uploaded to employee file.");
                app3.setApprover("Tara Anand");
                app3.setDecisionDate(LocalDateTime.now().minusDays(1));
                approvalRepository.save(app3);
            }

            // Seed Notifications if empty
            if (notificationRepository.count() == 0) {
                notificationRepository.save(new NotificationItem("NOT-001", "New Service Request Assigned",
                        "Request REQ-0004 \"Office Wi-Fi drops in conference rooms\" has been assigned to you by Admin.",
                        "Request", true, "/requests", "Critical"));
                notificationRepository.save(new NotificationItem("NOT-002", "Approval Required: Production IAM Access",
                        "James Wilson requested privileged AWS ProductionOpsAdmin access for 48 hours.",
                        "Approval", true, "/approvals", "Critical"));
                notificationRepository.save(new NotificationItem("NOT-003", "Task Status Updated to Review",
                        "Elena Rostova moved task TSK-1003 \"Quarterly SOC2 Type II compliance\" to Review.",
                        "Task", true, "/tasks", "High"));
            }
        };
    }
}
