import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/loginPage';
import { getCredentials } from '../../../support/utils/settingsConfig';
import * as allure from 'allure-js-commons'

let loginPage: LoginPage;

test.beforeEach(async ({ page }) => {
  await allure.parentSuite('Login')
  await page.goto('/');
 ({ USERNAME, PASSWORD } = getCredentials());

  loginPage = new LoginPage(page);
});

//login

test.describe('Login Page', () => {
  test('Verify the login page with valid email and password', {tag: '@smoke' } , async () => {
    console.log(` *** Environment: ${process.env.ENVIRONMENT!}`);
    console.log(` *** Username: ${USERNAME} `);
    //const baseURL = test.info().project.use.baseURL!; //How to access the baseURL inside the test

    await test.step('Log in', async () => {
      await loginPage.loginUI(USERNAME, PASSWORD);
    });
  });

  test('Verify the login page with invalid email', async ({ page }) => {
    await loginPage.loginUI('invalid', PASSWORD);
    await loginPage.checkInvalidCredentials();
  });
  test('Verify the login page with invalid password', async ({ page }) => {
    await loginPage.loginUI(USERNAME, 'invalid');
    await loginPage.checkInvalidCredentials();
  });
});
