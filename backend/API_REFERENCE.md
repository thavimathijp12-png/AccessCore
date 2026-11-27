# AccessCore Backend API Reference

Base URL: `http://localhost:8080/api`

## Authentication
All protected endpoints require an `Authorization: Bearer <jwt>` header.

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Backend health check |
| `POST` | `/api/auth/login` | Public | Authenticate and receive JWT |
| `POST` | `/api/auth/switch-role` | Public | Switch active role with password verification |
| `GET` | `/api/auth/me` | Authenticated | Return current user profile |
| `GET` | `/api/requests` | Authenticated | List service requests |
| `POST` | `/api/requests` | Authenticated | Create a service request |
| `PATCH` | `/api/requests/{code}/status` | Authenticated | Update service request status |
| `DELETE` | `/api/requests/{code}` | `ADMIN` | Delete a service request |
| `GET` | `/api/tasks` | Authenticated | List tasks |
| `POST` | `/api/tasks` | `ADMIN`, `TEAM_LEAD` | Create a task |
| `PATCH` | `/api/tasks/{code}/status` | Authenticated | Update task status |
| `DELETE` | `/api/tasks/{code}` | `ADMIN` | Delete a task |
| `GET` | `/api/bugs` | Authenticated | List bug reports |
| `POST` | `/api/bugs` | Authenticated | Create a bug report |
| `PATCH` | `/api/bugs/{code}/status` | Authenticated | Update bug status |
| `GET` | `/api/approvals` | Authenticated | List approvals |
| `POST` | `/api/approvals/{code}/decision` | `ADMIN`, `TEAM_LEAD` | Approve or reject an approval |
| `GET` | `/api/notifications` | Authenticated | List notifications |
| `PATCH` | `/api/notifications/{code}/read` | Authenticated | Mark notification as read |
| `PATCH` | `/api/notifications/read-all` | Authenticated | Mark all notifications as read |
| `GET` | `/api/team` | Authenticated | List team directory members |
| `GET` | `/api/users` | `ADMIN` | List all users |
| `POST` | `/api/users` | `ADMIN` | Create user |
| `PATCH` | `/api/users/{code}` | `ADMIN` | Update user |
| `DELETE` | `/api/users/{code}` | `ADMIN` | Delete user |
