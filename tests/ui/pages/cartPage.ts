import { expect, type Locator, type Page } from '@playwright/test';
export default class CartPage {
  private readonly page: Page;
  private readonly title: Locator;
  private readonly buttonCheckout: Locator;
  private readonly Item: Locator;
  private readonly ItemPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.buttonCheckout = page.getByTestId('checkout');
  }

  async verifyPageOpened() {
    await expect(this.page).toHaveURL(/.*cart/);
    await expect(this.title).toHaveText('Your Cart');
  }

  async clickOnCheckout() {
    //await expect(this.buttonCheckout).toHaveText('Checkout', { ignoreCase: true }); //When we pass the ignoreCase = true, we are telling to ignore case-sensitive
    //"Checkout", "CHECKOUT", "checkout", etc all these options will be validate.
    await expect(this.buttonCheckout).toHaveText('Checkout'); //By default toHaveText is false
    await this.buttonCheckout.click();
  }

  async verifyItemOnTheList(items: Array<string>) {
    await expect(this.page.locator("[data-test='inventory-item']", { hasText: items[0] })).toBeVisible();
    await expect(
      this.page.locator("[data-test='inventory-item']", { hasText: items[0] }).locator("[data-test='inventory-item-price']", { hasText: '$7.99' }),
    ).toBeVisible();

    //const grid = await this.page.getByTestId('cart-list');
    //await expect(grid.locator("[data-test='inventory-item-name']", { hasText: items[0] })).toBeVisible();

    /*
    items.forEach((element) => {
      expect(grid.locator("[data-test='inventory-item-name']", { hasText: element })).toBeVisible();
    });*/

    //const parent = await grid.locator("[data-test='inventory-item-name']", { hasText: items[0] }).evaluateHandle((element) => element.parentElement);
    // await referenceElement.evaluateHandle(element => element.previousSibling);

    //const product = await grid.locator("[data-test='inventory-item ']", { hasText: items[0] });
  }
}
