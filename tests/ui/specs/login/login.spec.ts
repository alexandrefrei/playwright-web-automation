import { test, expect } from '@playwright/test';
import { USER_EMAIL, PASSWORD } from '../../../support/utils/config';
import LoginPage from '../../pages/loginPage';

let loginPage: LoginPage;

test.beforeEach(async ({ page }) => {
  await allure.parentSuite('Login')
  await page.goto('/');
  // await page.goto('https://admin.cordial.io/#/login');

  loginPage = new LoginPage(page);
});

//login

test.describe('Login Page @smokeTest', () => {
  test('Verify the login page with valid email and password', async () => {
    console.log(` *** Environment: ${process.env.ENVIRONMENT!}`);
    //const baseURL = test.info().project.use.baseURL!; //How to access the baseURL inside the test

    await test.step('Log in', async () => {
      await loginPage.loginUI(USER_EMAIL, PASSWORD);
    });
  });

  test('Verify the login page with invalid email', async ({ page }) => {
    await loginPage.loginUI('invalid', PASSWORD);
    await loginPage.checkInvalidCredentials();
  });
  test('Verify the login page with invalid password', async ({ page }) => {
    await loginPage.loginUI(USER_EMAIL, 'invalid');
    await loginPage.checkInvalidCredentials();
  });
});
