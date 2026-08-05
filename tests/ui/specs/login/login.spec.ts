import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/loginPage';
import { getCredentials } from '../../../support/utils/settingsConfig';
import * as allure from 'allure-js-commons'

let loginPage: LoginPage;
let username: string;
let password: string;

test.beforeEach(async ({ page }) => {
  await allure.parentSuite('Login')
  await page.goto('/');
 ({ username, password } = getCredentials());

  loginPage = new LoginPage(page);
});

test.describe('Login Page', () => {
  test('Verify the login page with valid email and password', {tag: '@smoke' } , async () => {
    //const baseURL = test.info().project.use.baseURL!; //How to access the baseURL inside the test
    await loginPage.loginUI(username, password);
  });

  /*
  test('Verify the login page with invalid email', async () => {
    await loginPage.loginUI('invalid', password);
    await loginPage.checkInvalidCredentials();
  });
  test('Verify the login page with invalid password', async () => {
    await loginPage.loginUI(username, 'invalid');
    await loginPage.checkInvalidCredentials();
  });*/
});
