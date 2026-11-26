import {
  normalizeRole,
  getRoleKey,
  getRoleDashboardPath,
  validateRoleAccess,
  isRouteAllowedForRole
} from '../src/utils/roleUtils.js'

let passed = 0
let failed = 0

function assert(condition, message) {
  if (!condition) {
    failed++
    console.error(`[FAIL] ${message}`)
    throw new Error(message)
  } else {
    passed++
    console.log(`[PASS] ${message}`)
  }
}

console.log('====================================================')
console.log(' ACCESSCORE — Phase 1 Role-Based Architecture Tests')
console.log('====================================================\n')

// 1. Role Normalization
assert(normalizeRole('ADMIN') === 'Admin', 'normalizeRole("ADMIN") should be "Admin"')
assert(normalizeRole('TEAM_LEAD') === 'Team Lead', 'normalizeRole("TEAM_LEAD") should be "Team Lead"')
assert(normalizeRole('LEAD') === 'Team Lead', 'normalizeRole("LEAD") should be "Team Lead"')
assert(normalizeRole('EMPLOYEE') === 'Employee', 'normalizeRole("EMPLOYEE") should be "Employee"')
assert(normalizeRole('USER') === 'Employee', 'normalizeRole("USER") should be "Employee"')

// 2. Role Key resolution
assert(getRoleKey('Admin') === 'admin', 'getRoleKey("Admin") === "admin"')
assert(getRoleKey('Team Lead') === 'lead', 'getRoleKey("Team Lead") === "lead"')
assert(getRoleKey('Employee') === 'employee', 'getRoleKey("Employee") === "employee"')

// 3. Dashboard Redirection Paths
assert(getRoleDashboardPath('Admin') === '/admin/dashboard', 'Admin redirects to /admin/dashboard')
assert(getRoleDashboardPath('Team Lead') === '/lead/dashboard', 'Team Lead redirects to /lead/dashboard')
assert(getRoleDashboardPath('Employee') === '/employee/dashboard', 'Employee redirects to /employee/dashboard')

// 4. Role Mismatch Prevention Logic
// Admin portal with Admin account
const adminLogin = validateRoleAccess('Admin', 'admin')
assert(adminLogin.allowed === true && adminLogin.redirectPath === '/admin/dashboard', 'Admin logging into Admin portal succeeds and redirects to /admin/dashboard')

// Lead portal with Lead account
const leadLogin = validateRoleAccess('Team Lead', 'lead')
assert(leadLogin.allowed === true && leadLogin.redirectPath === '/lead/dashboard', 'Lead logging into Lead portal succeeds and redirects to /lead/dashboard')

// Employee portal with Employee account
const empLogin = validateRoleAccess('Employee', 'employee')
assert(empLogin.allowed === true && empLogin.redirectPath === '/employee/dashboard', 'Employee logging into Employee portal succeeds and redirects to /employee/dashboard')

// Mismatch 1: Employee trying to log into Admin portal
const empAdminAttempt = validateRoleAccess('Employee', 'admin')
assert(empAdminAttempt.allowed === false && empAdminAttempt.error.includes('Role Mismatch'), 'Employee attempting Admin portal login is blocked with Role Mismatch')

// Mismatch 2: Lead trying to log into Admin portal
const leadAdminAttempt = validateRoleAccess('Team Lead', 'admin')
assert(leadAdminAttempt.allowed === false && leadAdminAttempt.error.includes('Role Mismatch'), 'Lead attempting Admin portal login is blocked with Role Mismatch')

// Mismatch 3: Admin trying to log into Employee portal
const adminEmpAttempt = validateRoleAccess('Admin', 'employee')
assert(adminEmpAttempt.allowed === false && adminEmpAttempt.error.includes('Role Mismatch'), 'Admin attempting Employee portal login is blocked with Role Mismatch')

// 5. Route Protection & Authorization Checks
// Admin Route Guards
assert(isRouteAllowedForRole('Admin', ['ADMIN']) === true, 'Admin can access Admin routes')
assert(isRouteAllowedForRole('Team Lead', ['ADMIN']) === false, 'Lead cannot access Admin routes')
assert(isRouteAllowedForRole('Employee', ['ADMIN']) === false, 'Employee cannot access Admin routes')

// Lead Route Guards
assert(isRouteAllowedForRole('Team Lead', ['LEAD', 'TEAM_LEAD']) === true, 'Lead can access Lead routes')
assert(isRouteAllowedForRole('Admin', ['LEAD', 'TEAM_LEAD']) === false, 'Admin cannot access Lead routes without delegation')
assert(isRouteAllowedForRole('Employee', ['LEAD', 'TEAM_LEAD']) === false, 'Employee cannot access Lead routes')

// Employee Route Guards
assert(isRouteAllowedForRole('Employee', ['EMPLOYEE']) === true, 'Employee can access Employee routes')
assert(isRouteAllowedForRole('Admin', ['EMPLOYEE']) === false, 'Admin cannot access Employee routes directly')

console.log(`\n====================================================`)
console.log(` Summary: ${passed} Passed, ${failed} Failed out of ${passed + failed} Tests`)
console.log('====================================================\n')
