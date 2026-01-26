import { expect, type Locator, type Page } from '@playwright/test';
export default class HomePage {
  private readonly page: Page;
  private readonly buttonAddToCartBackpack: Locator;
  private readonly buttonRemoveToCartBackpack: Locator;
  private readonly inventoryPrice: Locator;
  private readonly numberOfProducts: Locator;
  private readonly buttonCart: Locator;

  constructor(page: Page) {
    this.page = page;

    this.buttonAddToCartBackpack = page.getByTestId('add-to-cart-sauce-labs-backpack');
    //this.buttonAddToCartBackpack = page.locator('#add-to-cart-sauce-labs-backpack');
    this.buttonRemoveToCartBackpack = page.getByTestId('remove-sauce-labs-backpack');

    this.numberOfProducts = page.getByTestId('shopping-cart-badge');
    //this.numberOfProducts = page.locator('span[class='shopping_cart_badge']');

    this.buttonCart = page.getByTestId('shopping-cart-link');
  }

  async verifyPageOpened() {
    await expect(this.page).toHaveURL(/.*inventory/);
    await expect(this.page).toHaveTitle(/Swag Labs/);
  }

  async verifyNumberOfAtCart(item: string) {
    await expect(this.numberOfProducts).toHaveText(item);
  }
  async clickAtCart() {
    await this.buttonCart.click();
  }

  async addBackpackItemToCart() {
    await expect(this.buttonAddToCartBackpack).toHaveText('Add to cart');
    await this.buttonAddToCartBackpack.click();
    await expect(this.buttonRemoveToCartBackpack).toHaveText('Remove');
  }
}
