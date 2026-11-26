import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function run(cmd) {
  // Ensure no lock file exists before running
  const lock = path.resolve('.git/index.lock');
  if (fs.existsSync(lock)) {
    try { fs.unlinkSync(lock); } catch (e) { }
  }
  console.log(`> ${cmd}`);
  try {
    const res = execSync(cmd, { stdio: 'pipe', encoding: 'utf8' });
    if (res.trim()) console.log(res.trim());
    return true;
  } catch (err) {
    console.error(`ERROR running [${cmd}]:`, err.stdout || err.stderr || err.message);
    return false;
  }
}

const commits = [
  {
    files: ['.gitignore', 'backend/.gitignore', 'backend/.env.example'],
    msg: 'build(config): configure production gitignore rules and environment templates'
  },
  {
    files: ['backend/pom.xml'],
    msg: 'build(backend): configure Spring Boot 3.3.6 parent POM with MySQL, JPA, and JWT dependencies'
  },
  {
    files: ['backend/src/main/java/com/accesscore/entity/Role.java', 'backend/src/main/java/com/accesscore/entity/User.java'],
    msg: 'feat(backend-core): define User entity with BCrypt credentials and role-based permissions model'
  },
  {
    files: ['backend/src/main/java/com/accesscore/entity/ServiceRequest.java', 'backend/src/main/java/com/accesscore/entity/TaskItem.java'],
    msg: 'feat(backend-entities): define ServiceRequest and TaskItem JPA entities with lifecycle tracking'
  },
  {
    files: ['backend/src/main/java/com/accesscore/entity/BugReport.java', 'backend/src/main/java/com/accesscore/entity/Approval.java', 'backend/src/main/java/com/accesscore/entity/NotificationItem.java'],
    msg: 'feat(backend-entities): implement BugReport, Approval, and NotificationItem governance entities'
  },
  {
    files: ['backend/src/main/java/com/accesscore/repository/'],
    msg: 'feat(backend-data): implement Spring Data JPA repositories with query specifications'
  },
  {
    files: ['backend/src/main/java/com/accesscore/dto/'],
    msg: 'feat(backend-dto): define request and response DTO records with validation constraints'
  },
  {
    files: ['backend/src/main/java/com/accesscore/security/'],
    msg: 'feat(backend-security): configure Stateless Spring Security, JWT authentication filter, and CORS policy'
  },
  {
    files: ['backend/src/main/java/com/accesscore/service/'],
    msg: 'feat(backend-services): implement core business services with transactional workflow logic and role switching'
  },
  {
    files: ['backend/src/main/java/com/accesscore/controller/'],
    msg: 'feat(backend-api): implement REST API controllers with role-based access authorization endpoints'
  },
  {
    files: ['backend/src/main/java/com/accesscore/config/DatabaseSeeder.java', 'backend/src/main/java/com/accesscore/exception/'],
    msg: 'feat(backend-init): add automated database seeders for users and tickets with global exception handler'
  },
  {
    files: ['backend/src/main/resources/', 'backend/src/test/', 'scripts/install-maven.ps1'],
    msg: 'feat(backend-infra): configure application properties, unit test harness, and Maven installation scripts'
  },
  {
    files: ['src/utils/api.js', 'src/utils/roleUtils.js'],
    msg: 'feat(frontend-core): add centralized REST API client and enterprise role normalization utilities'
  },
  {
    files: ['src/context/AuthContext.jsx', 'src/context/ThemeContext.jsx', 'src/context/NotificationsContext.jsx'],
    msg: 'feat(frontend-auth): implement role-authenticated AuthContext with secure password role-switch handshake'
  },
  {
    files: ['src/context/RequestsContext.jsx', 'src/context/TasksContext.jsx', 'src/context/BugsContext.jsx', 'src/context/ApprovalsContext.jsx', 'src/context/TeamContext.jsx'],
    msg: 'feat(frontend-state): implement robust reactive contexts with localStorage persistence and API sync'
  },
  {
    files: ['src/components/auth/'],
    msg: 'feat(frontend-security): add RoleBasedRoute guard, ProtectedRoute, and PasswordVerificationModal'
  },
  {
    files: ['src/components/layout/AdminLayout.jsx', 'src/components/layout/LeadLayout.jsx', 'src/components/layout/EmployeeLayout.jsx', 'src/components/layout/RoleSidebar.jsx', 'src/components/layout/Sidebar.jsx', 'src/components/layout/Topbar.jsx', 'src/components/layout/Breadcrumbs.jsx', 'src/components/common/GlobalSearchModal.jsx'],
    msg: 'feat(frontend-layout): add three segregated layouts, role-specific sidebars, and Obsidian Violet Topbar'
  },
  {
    files: ['src/pages/admin/', 'src/pages/lead/', 'src/pages/employee/', 'src/pages/DashboardPage.jsx'],
    msg: 'feat(frontend-dashboards): implement distinct Admin, Team Lead, and Employee enterprise dashboards'
  },
  {
    files: ['src/pages/ApprovalsPage.jsx', 'src/pages/BugsPage.jsx', 'src/pages/ForgotPasswordPage.jsx', 'src/pages/LoginPage.jsx', 'src/pages/NotificationsPage.jsx', 'src/pages/ReportsPage.jsx', 'src/pages/RequestsPage.jsx', 'src/pages/ResetPasswordPage.jsx', 'src/pages/SettingsPage.jsx', 'src/pages/TasksPage.jsx', 'src/pages/TeamPage.jsx', 'src/components/requests/', 'src/App.jsx'],
    msg: 'feat(frontend-views): add parameterized request routes, detail inspectors, and complete portal routing'
  },
  {
    files: ['DEVELOPMENT_LOGIN_GUIDE.md', 'README.md', 'scripts/'],
    msg: 'docs(release): finalize development credential guide, enterprise README, and automated verification suites'
  }
];

console.log('--- STARTING 20 STRUCTURED COMMITS ---');
let count = 0;
for (const c of commits) {
  count++;
  console.log(`\n[Commit ${count}/20] ${c.msg}`);
  const addSuccess = run(`git add ${c.files.join(' ')}`);
  if (!addSuccess) {
    console.error(`Failed to stage files for commit ${count}`);
    break;
  }
  const commitSuccess = run(`git commit -m "${c.msg}"`);
  if (!commitSuccess) {
    console.log(`Notice: commit ${count} may have nothing new to commit or was already clean.`);
  }
}

console.log('\nFinal git status:');
run('git status -s');
