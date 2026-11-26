# ACCESSCORE – Enterprise Workflow & Service Management System

![ACCESSCORE Version](https://img.shields.io/badge/version-1.0.0-6D4AFF?style=flat-square)
![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.0.0-purple?style=flat-square&logo=vite)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.6-6DB33F?style=flat-square&logo=springboot)
![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=openjdk)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

**ACCESSCORE** is an enterprise-grade full-stack workflow, service request, and team orchestration platform engineered with modern React, Vite, Java Spring Boot 3, and MySQL 8.0. Featuring the signature **Obsidian Violet** design system, ACCESSCORE provides seamless end-to-end task automation, request management, agile Kanban workflows, role-based access control (Admin, Team Lead, Employee), bug tracking, governance approvals, and live relational database persistence.

---

## 🌟 Key Features

- **Obsidian Violet Design System**: Polished dark Obsidian sidebar (`#11111B`), Electric Violet accents (`#6D4AFF`), Soft Violet highlights (`#A78BFA`), crisp white cards, and luminous lavender canvas (`#F4F2FF`).
- **Signature Core Diamond (◈) Identity**: Minimal, geometric brand identity integrated across the application header, authentication screens, and high-fidelity browser favicon.
- **Multi-Role Role-Based Access Control (RBAC)**:
  - **Admin (Tara Anand)**: System-wide telemetry, cross-department KPI monitors, audit logs, team governance, and velocity analytics.
  - **Team Lead (Marcus Vance)**: Team workload balancing, pending approval queues, SLA dispatch, and sprint tracking.
  - **Employee (Elena Chen)**: Self-service request creation, ticket progress tracker, assigned tasks, and incident reporting.
- **Interactive Kanban Task Management**: 4-column drag-and-drop workflow (`To Do`, `In Progress`, `Review`, `Done`) with priority badges, member assignees, and real-time state persistence.
- **Service Request Lifecycle**: Filterable, searchable request catalog with status chips (`Pending`, `In Progress`, `Approved`, `Rejected`), detailed modal drawer, and approval auditing.
- **Bug & Incident Tracking**: Severity-classified issue boards (`Critical`, `High`, `Medium`, `Low`) with reproduction steps and resolution timelines.
- **Governance & Approvals**: One-click approval/rejection workflows with auditable rationale dialogs.
- **Global Search & Quick Actions**: Instant fuzzy navigation modal (`Ctrl+K` / `Cmd+K`) across projects, requests, members, and documentation.
- **Automated Verification**: Integrated QA test suite verifying branding, routing, contexts, and visual design compliance.

---

## 🎨 Theme Palette (Obsidian Violet)

| Token | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Obsidian** | `#11111B` | Sidebar navigation, dark structural framing |
| **Primary Violet** | `#6D4AFF` | Primary buttons, active indicators, brand accent |
| **Soft Violet** | `#A78BFA` | Badges, secondary highlights, subtle accents |
| **Canvas Background** | `#F4F2FF` | Main application content background |
| **Card Background** | `#FFFFFF` | Elevated cards, tables, modals, input containers |
| **Text Primary** | `#1E1B2E` | Headings, primary typography, high-contrast labels |
| **Text Secondary** | `#64748B` | Subtext, timestamps, secondary metadata |
| **Borders** | `#E5E1EF` | Refined card borders, separators, table dividers |

---

## 🛠️ Technology Stack

- **Core Framework**: [React 19](https://react.dev/)
- **Build Tooling & Bundler**: [Vite 6](https://vitejs.dev/)
- **Styling & Design Tokens**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Data Visualization**: Recharts / Custom SVG Analytics
- **Quality Assurance**: Automated Node.js audit suite (`scripts/qa-audit.js`)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/thavimathijp12-png/AccessCore.git
   cd AccessCore
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

4. **Run the production build**:
   ```bash
   npm run build
   ```

5. **Preview the production build**:
   ```bash
   npm run preview
   ```

6. **Run the automated QA test suite**:
   ```bash
   npm run test:qa # or: node scripts/qa-audit.js
   ```

### Backend Setup (Spring Boot & MySQL)

1. **Configure Environment Variables**:
   Create `backend/.env` with your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=accesscore_db
   DB_USERNAME=root
   DB_PASSWORD=your_mysql_password
   ```

2. **Run Backend Unit & Integration Tests**:
   ```powershell
   cd backend
   mvn clean test
   ```

3. **Start Spring Boot Application**:
   ```powershell
   cd backend
   mvn spring-boot:run -Dspring-boot.run.profiles=mysql
   ```
   The backend API will be available at `http://localhost:8080/api`.

---

## 📡 REST API Catalog

| Module | Endpoint | Method | Description |
| :--- | :--- | :---: | :--- |
| **Auth** | `/api/auth/login` | `POST` | Authenticate with email and password, returns JWT token |
| **Auth** | `/api/auth/switch-role` | `POST` | Switch persona (Admin, Team Lead, Employee) |
| **Auth** | `/api/auth/me` | `GET` | Retrieve current authenticated user profile |
| **Health** | `/api/health` | `GET` | Service status & database connectivity telemetry |
| **Requests** | `/api/requests` | `GET` | List all service requests |
| **Requests** | `/api/requests` | `POST` | Create a new service request |
| **Requests** | `/api/requests/{code}/status` | `PATCH` | Update request lifecycle status |
| **Tasks** | `/api/tasks` | `GET` | List all tasks across Kanban columns |
| **Tasks** | `/api/tasks` | `POST` | Create new workflow task |
| **Tasks** | `/api/tasks/{code}/status` | `PATCH` | Advance task status (`TODO`, `IN_PROGRESS`, `REVIEW`, `COMPLETED`) |
| **Bugs** | `/api/bugs` | `GET` | List incident and bug reports |
| **Bugs** | `/api/bugs` | `POST` | Report a new bug |
| **Bugs** | `/api/bugs/{code}/status` | `PATCH` | Update bug resolution status |
| **Approvals** | `/api/approvals` | `GET` | List governance approvals |
| **Approvals** | `/api/approvals/{code}/decision` | `POST` | Approve or reject request with logged audit note |
| **Team** | `/api/team` | `GET` | List team members and role metadata |
| **Notifications** | `/api/notifications` | `GET` | Fetch enterprise notification feed |
| **Notifications** | `/api/notifications/{code}/read` | `PATCH` | Mark notification as read |
| **Notifications** | `/api/notifications/read-all` | `PATCH` | Mark all notifications as read |

---

## 📁 Project Architecture

```
AccessCore/
├── public/                     # Static assets and icons
│   ├── accesscore-logo.png     # Official high-resolution brand asset
│   ├── favicon.png             # Core Diamond (◈) 32x32 PNG favicon
│   └── favicon.svg             # Core Diamond (◈) scalable SVG favicon
├── src/
│   ├── assets/                 # Application images and SVG assets
│   ├── components/             # Reusable UI component library
│   │   ├── common/             # Global components (Logo, SearchModal)
│   │   ├── layout/             # Sidebar, Topbar, Breadcrumbs, AppLayout
│   │   ├── requests/           # Request forms, tables, detail modals
│   │   └── ui/                 # Atomic UI (Buttons, Cards, Badges, Modals, Toasts)
│   ├── context/                # React State Contexts (Auth, Requests, Tasks, etc.)
│   ├── data/                   # Mock enterprise datasets (Users, Tickets, Approvals)
│   ├── hooks/                  # Custom React hooks (useToast, useIsMobile, etc.)
│   ├── pages/                  # Application views (Dashboard, Tasks, Login, etc.)
│   ├── router/                 # Client-side route declarations
│   ├── utils/                  # Formatting and helper utilities
│   ├── App.jsx                 # Root component wrapper
│   ├── index.css               # Obsidian Violet design token definitions
│   └── main.jsx                # Application entry point
├── scripts/
│   └── qa-audit.js             # Automated 20-point QA verification script
├── index.html                  # HTML5 entry with Core Diamond favicon
├── package.json                # Project dependencies and script declarations
├── tailwind.config.js          # Tailwind CSS theme configuration
└── vite.config.js              # Vite bundler plugins and alias configuration
```

---

## 👥 Role Credentials & Testing

The application supports instant role switching via the top navigation or user menu:

| Role | Default User | Capabilities |
| :--- | :--- | :--- |
| **Admin** | **Tara Anand** | Full platform governance, analytics, team management, audit logs |
| **Team Lead** | **Marcus Vance** | Queue approvals, task allocation, sprint oversight |
| **Employee** | **Elena Chen** | Ticket submission, self-service request tracking, personal board |

---

## 📸 Screenshots & UI Showcase

- **Dashboard**: High-level velocity metrics, real-time activity feeds, and quick actions styled in the Obsidian Violet theme.
- **Kanban Board**: Drag-and-drop task orchestration with automated column distribution.
- **Request Catalog**: Comprehensive enterprise request lifecycle tracking with granular audit history.
- **Authentication**: Modern authentication flows (Login, Forgot Password, Reset Password) featuring the Core Diamond branding.

---

## 📄 License

This project is licensed under the MIT License.

<!-- pr-ref: feature/employee-dashboard -->
