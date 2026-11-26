# ACCESSCORE — Development Login & Role Permissions Guide

This guide documents the dedicated local development credentials and permissions for the three segregated ACCESSCORE roles (**Admin**, **Team Lead**, and **Employee**).

---

## 1. Verified Development Accounts

All passwords are cryptographically salted and hashed with **BCrypt** (`$2a$10$...`) and stored in the database via the Spring Boot `DatabaseSeeder`.

| Role | Portal URL | Email Address | Password | Permissions Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | [`/login?role=admin`](http://localhost:5173/login?role=admin) | `tara.anand@accesscore.io` | `admin123` | **Full Platform Administration**: User & Role Management, System Settings, Audit Activity, All Service Requests, Task Management, Approvals, Bug Reports, and Organization-wide Analytics. |
| **Team Lead** | [`/login?role=lead`](http://localhost:5173/login?role=lead) | `sarah.chen@accesscore.io` | `lead123` | **Operations & Supervision**: View Assigned Team Members, Assign Sprint Tasks, Review Team Service Requests, Approve/Reject Requests, Triage Team Bugs, and Monitor Team Performance. |
| **Employee** | [`/login?role=employee`](http://localhost:5173/login?role=employee) | `james.wilson@accesscore.io` | `emp123` | **Self-Service & Workspace**: View Personal Assigned Tasks, Update Task Statuses, Submit Service Requests, Report Software Bugs, Track Own Progress, and Manage Profile. |

### Secondary Development Accounts

- **Team Lead (Compliance)**: `elena.rostova@accesscore.io` / `lead123`
- **Employee (Operations)**: `mike.torres@accesscore.io` / `emp123`

---

## 2. Role-Based Navigation & Permissions Matrix

| Module / Endpoint | Admin (`ROLE_ADMIN`) | Team Lead (`ROLE_TEAM_LEAD`) | Employee (`ROLE_EMPLOYEE`) |
| :--- | :---: | :---: | :---: |
| **Dashboard Overview** | `/admin/dashboard` (Full Governance) | `/lead/dashboard` (Team Operations) | `/employee/dashboard` (Personal Queue) |
| **User Management** (`/api/users`) | **Full CRUD** (Create, Edit, Deactivate) | ❌ Restricted | ❌ Restricted |
| **Role Permissions** (`/admin/roles`) | **Full Access** | ❌ Restricted | ❌ Restricted |
| **Team Directory** (`/api/team`) | View All Organizations & Users | View Department Team Members | View Team Directory |
| **Task Assignment** (`POST /api/tasks`) | Permitted | Permitted | ❌ Restricted |
| **Task Status Update** (`PATCH /api/tasks/{code}/status`) | Permitted | Permitted | Permitted (Assigned Tasks) |
| **Service Requests** (`GET /api/requests`) | View All Global Requests | View Department Requests | View Own Created/Assigned Requests |
| **Request Creation** (`POST /api/requests`) | Permitted | Permitted | Permitted |
| **Request Deletion** (`DELETE /api/requests/{code}`) | Permitted | ❌ Restricted | ❌ Restricted |
| **Approval Decisions** (`POST /api/approvals/{code}/decision`) | Permitted | Permitted | ❌ Blocked (`403 Forbidden`) |
| **Bug Reporting** (`POST /api/bugs`) | Permitted | Permitted | Permitted |
| **System Settings** (`/admin/settings`) | Permitted | ❌ Restricted | ❌ Restricted |

---

## 3. Security & Zero-Trust Enforcement

1. **Backend API Authorization**:
   - Protected with Spring Security `@EnableMethodSecurity` and `@PreAuthorize("hasRole(...)")`.
   - Unauthorized attempts return `403 Forbidden` at the HTTP API layer.
2. **Role Mismatch Prevention**:
   - The login page validates the authenticated account's actual role returned from the backend.
   - An Employee attempting to authenticate through the Admin portal card is rejected with a **Role Mismatch** error.
3. **Route Guards**:
   - `RoleBasedRoute` prevents URL tampering. Navigating directly to an unauthorized portal automatically redirects the user to their authorized dashboard.
