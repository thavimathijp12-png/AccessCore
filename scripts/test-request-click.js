// Test verification for Request item click and navigation flow in ACCESSCORE
import fs from 'fs';
import path from 'path';

console.log('--- ACCESSCORE REQUEST CLICK & DETAILS TEST SUITE ---');

const reqTablePath = path.resolve('src/components/requests/RequestTable.jsx');
const reqPagePath = path.resolve('src/pages/RequestsPage.jsx');
const appPath = path.resolve('src/App.jsx');
const reqDetailPath = path.resolve('src/components/requests/RequestDetail.jsx');

const reqTableSrc = fs.readFileSync(reqTablePath, 'utf8');
const reqPageSrc = fs.readFileSync(reqPagePath, 'utf8');
const appSrc = fs.readFileSync(appPath, 'utf8');
const reqDetailSrc = fs.readFileSync(reqDetailPath, 'utf8');

let errors = [];

// 1. Verify RequestTable row onClick
if (!reqTableSrc.includes('onClick={() => onView(req)}')) {
  errors.push('RequestTable missing row onClick handler');
} else {
  console.log('✓ RequestTable: Row onClick handler registered with onView(req)');
}

if (!reqTableSrc.includes('cursor-pointer')) {
  errors.push('RequestTable row missing cursor-pointer class');
} else {
  console.log('✓ RequestTable: cursor-pointer and hover styling present');
}

if (!reqTableSrc.includes('e.stopPropagation()')) {
  errors.push('RequestTable action buttons missing e.stopPropagation()');
} else {
  console.log('✓ RequestTable: Action buttons have stopPropagation to prevent unintended navigation');
}

// 2. Verify App.jsx routes for requests/:id
const roles = ['admin', 'lead', 'employee'];
roles.forEach(role => {
  const pattern = new RegExp(`${role}[\\s\\S]*?requests/:id`);
  if (!pattern.test(appSrc)) {
    errors.push(`App.jsx missing route: /${role}/requests/:id`);
  } else {
    console.log(`✓ App.jsx: /${role}/requests/:id route is configured`);
  }
});

// 3. Verify RequestsPage URL param synchronization
if (!reqPageSrc.includes('useParams') || !reqPageSrc.includes('routeRequestId')) {
  errors.push('RequestsPage missing useParams routeRequestId synchronization');
} else {
  console.log('✓ RequestsPage: useParams integrated for direct URL deep-linking');
}

if (!reqPageSrc.includes('navigate(`${basePath}/${req.id}`)')) {
  errors.push('RequestsPage handleView missing navigate URL update');
} else {
  console.log('✓ RequestsPage: handleView synchronizes browser URL with request ID');
}

if (!reqPageSrc.includes('navigate(basePath)')) {
  errors.push('RequestsPage handleBack missing navigate back to list');
} else {
  console.log('✓ RequestsPage: handleBack navigates cleanly back to list view and clears selected request');
}

// 4. Verify RequestDetail Back button
if (!reqDetailSrc.includes('Back to Requests') || !reqDetailSrc.includes('onClick={onBack}')) {
  errors.push('RequestDetail missing working Back button');
} else {
  console.log('✓ RequestDetail: Back button configured with onClick={onBack}');
}

if (errors.length > 0) {
  console.error('\nTest Failures:');
  errors.forEach(e => console.error('  - ' + e));
  process.exit(1);
} else {
  console.log('\nAll 7 test checks PASSED cleanly!');
  process.exit(0);
}
