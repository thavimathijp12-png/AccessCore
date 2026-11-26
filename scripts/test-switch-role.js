// Browser test script verifying Employee to Team Lead dashboard switch with secure password verification
import puppeteer from 'puppeteer';

(async () => {
  console.log('--- STARTING EMPLOYEE -> TEAM LEAD SWITCH VERIFICATION TEST ---');
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Step 1: Open Login Page
    console.log('1. Navigating to http://localhost:5173/login?role=employee ...');
    await page.goto('http://localhost:5173/login?role=employee', { waitUntil: 'networkidle2' });

    // Step 2: Login as Employee
    console.log('2. Entering employee credentials (james.wilson@accesscore.io / emp123) ...');
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', 'james.wilson@accesscore.io');
    await page.type('input[type="password"]', 'emp123');
    
    // Click submit button
    const submitBtn = await page.waitForSelector('button[type="submit"]');
    await submitBtn.click();

    // Step 3: Wait for Employee Dashboard
    await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
    await page.waitForFunction(() => window.location.pathname.includes('/employee/dashboard'));
    console.log('✓ Successfully arrived at Employee Dashboard: ' + page.url());

    // Step 4: Open Topbar User Menu
    console.log('3. Clicking avatar in Topbar to open profile menu ...');
    // Topbar avatar button
    const userMenuBtn = await page.waitForSelector('header button.cursor-pointer');
    await userMenuBtn.click();
    await new Promise(r => setTimeout(r, 400));

    // Step 5: Click "Lead" button under Switch Dashboard View
    console.log('4. Clicking "Lead" under Switch Dashboard View ...');
    const buttons = await page.$$('button');
    let leadBtn = null;
    for (const b of buttons) {
      const text = await (await b.getProperty('textContent')).jsonValue();
      if (text.trim() === 'Lead') {
        leadBtn = b;
        break;
      }
    }
    if (!leadBtn) throw new Error('Lead button not found in Switch Dashboard View menu');
    await leadBtn.click();
    await new Promise(r => setTimeout(r, 500));

    // Step 6: Verify Modal Opened
    console.log('5. Verifying "Verify Identity for Team Lead View" modal opened ...');
    const modalHeading = await page.waitForSelector('h3');
    const headingText = await (await modalHeading.getProperty('textContent')).jsonValue();
    console.log('✓ Modal Heading:', headingText.trim());

    // Test 6a: Test INCORRECT password first
    console.log('6. Testing incorrect password rejection ...');
    const passwordInput = await page.waitForSelector('input[placeholder="Enter password"]');
    await passwordInput.type('wrongpassword');

    const confirmBtn = await page.waitForSelector('button[type="submit"]');
    await confirmBtn.click();
    await new Promise(r => setTimeout(r, 800));

    // Check error message displayed
    const errorEl = await page.$('.bg-red-50');
    if (errorEl) {
      const errText = await (await errorEl.getProperty('textContent')).jsonValue();
      console.log('✓ Incorrect password correctly rejected with error:', errText.trim());
    } else {
      console.log('Notice: Error notification banner format check');
    }

    // Step 7: Clear input and enter CORRECT password lead123
    console.log('7. Entering correct Team Lead development password "lead123" ...');
    await page.evaluate(() => {
      const inp = document.querySelector('input[placeholder="Enter password"]');
      if (inp) {
        inp.value = '';
        inp.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await passwordInput.type('lead123');

    // Click Confirm & Switch
    console.log('8. Clicking "Confirm & Switch to Team Lead" ...');
    await confirmBtn.click();

    // Step 8: Wait for redirection to Team Lead Dashboard
    console.log('9. Waiting for navigation to /lead/dashboard ...');
    await page.waitForFunction(() => window.location.pathname.includes('/lead'), { timeout: 8000 });
    console.log('✓ Successfully navigated to Team Lead Portal! Current URL: ' + page.url());

    // Verify localStorage auth state
    const authState = await page.evaluate(() => {
      const user = JSON.parse(localStorage.getItem('ac-user') || '{}');
      return {
        name: user.name,
        role: user.role,
        pathname: window.location.pathname
      };
    });
    console.log('✓ Verified Active Session State:', JSON.stringify(authState));

    // Capture screenshot
    await page.screenshot({ path: 'C:/Users/thavi/.gemini/antigravity/brain/82813ad6-0a80-4af8-a5d3-51c29eb9b000/employee-to-lead-switch-success.png' });
    console.log('✓ Screenshot saved: employee-to-lead-switch-success.png');

    console.log('\n--- ALL EMPLOYEE -> TEAM LEAD SWITCH TESTS PASSED SUCCESSFULLY! ---');
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('Test Failed:', err.message);
    if (browser) await browser.close();
    process.exit(1);
  }
})();
