import { test, expect } from '@playwright/test';
import { USER_EMAIL, PASSWORD } from '../../support/utils/config';
import LoginPage from '../pages/login-page';

let loginPage: LoginPage;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  loginPage = new LoginPage(page);
});

//login

test.describe('Login Page @smokeTest', () => {
  test('verify the login page with valid email and password', async ({ page }) => {
    //const baseURL = test.info().project.use.baseURL!; //How to access the baseURL inside the test
    await loginPage.loginUI(USER_EMAIL, PASSWORD);
    await loginPage.verifyPageOpened();
  });

  test('verify the login page with invalid email', async ({ page }) => {
    await loginPage.loginUI('invalid', PASSWORD);
    await loginPage.checkInvalidCredentials();
  });
  test('verify the login page with invalid password', async ({ page }) => {
    await loginPage.loginUI(USER_EMAIL, 'invalid');
    await loginPage.checkInvalidCredentials();
  });
});
