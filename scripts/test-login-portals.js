import fs from 'fs'
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
console.log(' ACCESSCORE — Three Separate Login Portals Verification')
console.log('====================================================\n')

// 1. Static UI Verification of LoginPage.jsx
const loginSource = fs.readFileSync('src/pages/LoginPage.jsx', 'utf-8')

// Check Portal definitions
assert(loginSource.includes("'admin'") && loginSource.includes("'Admin Login'"), 'Admin portal card configured in LoginPage.jsx')
assert(loginSource.includes("'lead'") && loginSource.includes("'Team Lead Login'"), 'Team Lead portal card configured in LoginPage.jsx')
assert(loginSource.includes("'employee'") && loginSource.includes("'Employee Login'"), 'Employee portal card configured in LoginPage.jsx')

// Check Role-specific Headings & Subtitles
assert(loginSource.includes('Platform Architecture & Governance'), 'Admin portal has distinct subtitle')
assert(loginSource.includes('Operations & Team Supervision'), 'Team Lead portal has distinct subtitle')
assert(loginSource.includes('Employee Workspace & Self-Service'), 'Employee portal has distinct subtitle')

// Check Role-specific Field Labels & Buttons
assert(loginSource.includes('Administrator Email') && loginSource.includes('Sign In as Admin'), 'Admin portal has specific Administrator Email label and Sign In as Admin button')
assert(loginSource.includes('Team Lead Email') && loginSource.includes('Sign In as Team Lead'), 'Team Lead portal has specific Team Lead Email label and Sign In as Team Lead button')
assert(loginSource.includes('Employee Email') && loginSource.includes('Sign In as Employee'), 'Employee portal has specific Employee Email label and Sign In as Employee button')

// Check Back to Portal Selection option
assert(loginSource.includes('Back to Portal Selection'), 'Back to Portal Selection option is prominently implemented')

// Check Show/Hide Password toggle
assert(loginSource.includes('showPassword ? <EyeOff size={16} /> : <Eye size={16} />'), 'Show/Hide password toggle is present with Eye/EyeOff icons')

// 2. Functional Route Verification in App.jsx
const appSource = fs.readFileSync('src/App.jsx', 'utf-8')
assert(appSource.includes('path="/login"') && appSource.includes('path="/login/:roleId"'), 'App.jsx routes support both /login and /login/:roleId')

// 3. Flow 1: Admin Authentication Flow
const adminAuth = validateRoleAccess('Admin', 'admin')
assert(adminAuth.allowed === true, 'Flow 1: Admin credentials permitted in Admin portal')
assert(adminAuth.redirectPath === '/admin/dashboard', 'Flow 1: Admin redirected to /admin/dashboard')

// 4. Flow 2: Team Lead Authentication Flow
const leadAuth = validateRoleAccess('Team Lead', 'lead')
assert(leadAuth.allowed === true, 'Flow 2: Team Lead credentials permitted in Team Lead portal')
assert(leadAuth.redirectPath === '/lead/dashboard', 'Flow 2: Team Lead redirected to /lead/dashboard')

// 5. Flow 3: Employee Authentication Flow
const empAuth = validateRoleAccess('Employee', 'employee')
assert(empAuth.allowed === true, 'Flow 3: Employee credentials permitted in Employee portal')
assert(empAuth.redirectPath === '/employee/dashboard', 'Flow 3: Employee redirected to /employee/dashboard')

// 6. Security Rejection: Mismatched Role Credentials Blocked
const empInAdmin = validateRoleAccess('Employee', 'admin')
assert(empInAdmin.allowed === false, 'Employee credentials blocked in Admin portal')
assert(empInAdmin.error.includes('Role Mismatch'), 'Role mismatch alert generated for Employee in Admin portal')

const leadInAdmin = validateRoleAccess('Team Lead', 'admin')
assert(leadInAdmin.allowed === false, 'Team Lead credentials blocked in Admin portal')
assert(leadInAdmin.error.includes('Role Mismatch'), 'Role mismatch alert generated for Team Lead in Admin portal')

const adminInLead = validateRoleAccess('Admin', 'lead')
assert(adminInLead.allowed === false, 'Admin credentials blocked in Team Lead portal')
assert(adminInLead.error.includes('Role Mismatch'), 'Role mismatch alert generated for Admin in Team Lead portal')

const adminInEmp = validateRoleAccess('Admin', 'employee')
assert(adminInEmp.allowed === false, 'Admin credentials blocked in Employee portal')
assert(adminInEmp.error.includes('Role Mismatch'), 'Role mismatch alert generated for Admin in Employee portal')

// 7. Route Guards: Direct Unauthorized URL Access Prevented
assert(isRouteAllowedForRole('Admin', ['ADMIN']) === true, 'Admin permitted on /admin/*')
assert(isRouteAllowedForRole('Employee', ['ADMIN']) === false, 'Employee blocked on /admin/* (redirects to /employee/dashboard)')
assert(isRouteAllowedForRole('Team Lead', ['ADMIN']) === false, 'Team Lead blocked on /admin/* (redirects to /lead/dashboard)')
assert(isRouteAllowedForRole('Employee', ['LEAD', 'TEAM_LEAD']) === false, 'Employee blocked on /lead/*')
assert(isRouteAllowedForRole('Team Lead', ['LEAD', 'TEAM_LEAD']) === true, 'Team Lead permitted on /lead/*')
assert(isRouteAllowedForRole('Employee', ['EMPLOYEE']) === true, 'Employee permitted on /employee/*')

console.log(`\n====================================================`)
console.log(` Results: All ${passed} Tests Passed, ${failed} Failed`)
console.log('====================================================\n')
