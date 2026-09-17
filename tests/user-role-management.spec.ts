import { test, expect } from '@playwright/test';

test.describe('User Role Management & Team Permissions', () => {
  
  test.beforeEach(async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('https://greendash.app');
    
    // 2. Fill in the login form fields
    await page.getByPlaceholder('Enter your email').fill('testing@mysuperhumanrace.com');
    await page.getByPlaceholder('Enter your password').fill('SecurePassword123!');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Validate dashboard redirect or URL change after login
    await expect(page).toHaveURL(/.*dashboard|.*controller/);
  });

  test('TC01 - Positive: Create a New Team Successfully', async ({ page }) => {
    // Go to team page
    await page.goto('https://greendash.appmanage-team');
    await expect(page.getByRole('heading', { name: 'TEAMS @ GOODPACT' })).toBeVisible();

    // Trigger the Add Team dialog
    await page.getByRole('button', { name: 'ADD TEAM' }).click();

    // Target the active dialog modal popup
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('ADD TEAM PERMISSIONS')).toBeVisible();

    // Fill Team Form Fields
    await dialog.getByLabel('Team Name').fill('QA Automation Team');
    await dialog.getByLabel('Volunteer').check();
    
    // Select Template Dropdown
    await dialog.locator('div').filter({ hasText: /^Select Template$/ }).click();
    await page.getByRole('option', { name: 'Data Entrys' }).click();

    // Save and close form
    await dialog.getByRole('button', { name: 'SAVE & CLOSE' }).click();

    // Confirm dialog disappears and new team is rendered
    await expect(dialog).toBeHidden();
    await expect(page.getByText('QA Automation Team')).toBeVisible();
  });

  test('TC02 - Positive: Assign Member Role to an Existing Team', async ({ page }) => {
    await page.goto('https://greendash.appmanage-team');

    // Locate the specific team row block and select member add button
    const teamRow = page.locator('tr').filter({ hasText: 'rftgyuhi67' });
    await teamRow.getByRole('button', { name: '+ MEMBER' }).click();

    // Validate the target user role overlay is active
    const memberModal = page.getByRole('dialog');
    await expect(memberModal.getByText('ADD MEMBER TO RFTGYUHI67')).toBeVisible();

    // Input target employee profile details
    await memberModal.getByLabel('Select User').fill('John Doe');
    await memberModal.getByLabel('Designation').fill('QA Lead');
    
    // Check permission configuration types
    await memberModal.getByLabel('Data Provider').check();
    await memberModal.getByLabel('CSR').check();

    await memberModal.getByRole('button', { name: 'SAVE & CLOSE' }).click();

    // Confirm changes persist correctly
    await expect(memberModal).toBeHidden();
    await expect(teamRow.locator('.members-count-badge')).toHaveText('2');
  });

  test('TC03 - Negative: Block Team Creation with Missing Required Form Fields', async ({ page }) => {
    await page.goto('https://greendash.appmanage-team');
    await page.getByRole('button', { name: 'ADD TEAM' }).click();

    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'SAVE & CLOSE' }).click();

    // Check HTML5 verification status elements to ensure form input is blocked
    const teamNameInput = dialog.getByLabel('Team Name');
    const isInvalid = await teamNameInput.evaluate((el: HTMLInputElement) => !el.checkValidity() || el.classList.contains('is-invalid'));
    expect(isInvalid).toBe(true);
  });
});
