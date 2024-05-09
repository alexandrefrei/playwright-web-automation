import { test, expect } from '@playwright/test';
import { USER_EMAIL, PASSWORD } from '../../support/utils/config';
import LoginPage from '../pages/loginPage';
import HomePage from '../pages/homePage';
import CartPage from '../pages/cartPage';

let loginPage: LoginPage;
let homePage: HomePage;
let cartPage: CartPage;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  loginPage = new LoginPage(page);
  homePage = new HomePage(page);
  cartPage = new CartPage(page);

  await loginPage.loginUI(USER_EMAIL, PASSWORD);
});

test.describe('Buy a Backpack @smokeTest', () => {
  test('Buying the first item Sauce Labs Backpack', async ({ page }) => {
    await homePage.verifyPageOpened();
    //await homePage.addBackpackItemToCart();
    //await homePage.verifyNumberOfAtCart('1');
    await page.getByTestId('add-to-cart-sauce-labs-bolt-t-shirt').click();
    await page.getByTestId('add-to-cart-test.allthethings()-t-shirt-(red)').click();
    await homePage.verifyNumberOfAtCart('2');
    await homePage.clickAtCart();

    await cartPage.verifyPageOpened();
    await cartPage.verifyItemOnTheList(['Sauce Labs Bolt T-Shirt']);
  });
});
