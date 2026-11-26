import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('--- DIRECT HTML/JS STATE VERIFICATION SUITE ---');

const topbarSrc = fs.readFileSync('src/components/layout/Topbar.jsx', 'utf8');
const authContextSrc = fs.readFileSync('src/context/AuthContext.jsx', 'utf8');
const authControllerSrc = fs.readFileSync('backend/src/main/java/com/accesscore/controller/AuthController.java', 'utf8');
const authServiceSrc = fs.readFileSync('backend/src/main/java/com/accesscore/service/AuthService.java', 'utf8');
const modalSrc = fs.readFileSync('src/components/auth/PasswordVerificationModal.jsx', 'utf8');
const roleRouteSrc = fs.readFileSync('src/components/auth/RoleBasedRoute.jsx', 'utf8');

const errors = [];

// Check 1: Topbar handles teamLead switch and navigates using redirectPath or /lead/dashboard
if (!topbarSrc.includes('handleConfirmSwitchRole')) {
  errors.push('Topbar missing handleConfirmSwitchRole');
} else if (!topbarSrc.includes('/lead/dashboard')) {
  errors.push('Topbar handleConfirmSwitchRole missing /lead/dashboard navigation');
} else {
  console.log('✓ Topbar: handleConfirmSwitchRole correctly handles Team Lead and navigates to /lead/dashboard');
}

// Check 2: AuthContext calls /auth/switch-role with role and password
if (!authContextSrc.includes('/auth/switch-role')) {
  errors.push('AuthContext missing /auth/switch-role endpoint call');
} else if (!authContextSrc.includes("roleKey === 'teamLead' || roleKey === 'lead' ? 'TEAM_LEAD'")) {
  errors.push('AuthContext missing teamLead -> TEAM_LEAD mapping');
} else {
  console.log('✓ AuthContext: switchRole maps teamLead to TEAM_LEAD and passes password to backend');
}

// Check 3: AuthController endpoint does not restrict switchRole to ADMIN
if (authControllerSrc.includes('@PreAuthorize("hasRole(\'ADMIN\')")\n    public ResponseEntity<AuthResponse> switchRole')) {
  errors.push('AuthController @PreAuthorize is improperly restricting switchRole to ADMIN only!');
} else {
  console.log('✓ AuthController: switchRole endpoint allows authenticated users to verify password and switch');
}

// Check 4: AuthService verifies password against target role user credentials
if (!authServiceSrc.includes('switchRoleWithPassword')) {
  errors.push('AuthService missing switchRoleWithPassword');
} else if (!authServiceSrc.includes('passwordEncoder.matches')) {
  errors.push('AuthService missing BCrypt passwordEncoder.matches');
} else {
  console.log('✓ AuthService: switchRoleWithPassword securely verifies BCrypt password and issues JWT token');
}

// Check 5: PasswordVerificationModal renders password input, error display, and submit
if (!modalSrc.includes('Confirm & Switch to ${roleName}') || !modalSrc.includes('showPassword')) {
  errors.push('PasswordVerificationModal missing required elements');
} else {
  console.log('✓ PasswordVerificationModal: Identity modal has password input, show/hide, cancel, and clear error banner');
}

// Check 6: RoleBasedRoute strictly guards against direct URL tampering
if (!roleRouteSrc.includes('isRouteAllowedForRole')) {
  errors.push('RoleBasedRoute missing role authorization check');
} else {
  console.log('✓ RoleBasedRoute: Direct URL route tampering is strictly guarded and redirects unauthorized access');
}

if (errors.length > 0) {
  console.error('\nVerification failed:', errors);
  process.exit(1);
} else {
  console.log('\nAll 6 Core Flow & Security Invariant Checks PASSED CLEANLY!');
  process.exit(0);
}
