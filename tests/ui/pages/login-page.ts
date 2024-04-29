import { expect, type Locator, type Page } from '@playwright/test';
export default class LoginPage {
  readonly page: Page;
  readonly userName: Locator;
  readonly password: Locator;
  readonly buttonLogin: Locator;

  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userName = page.getByPlaceholder('Username');
    this.password = page.getByPlaceholder('Password');

    /*
    //const inputName = page.getByRole("textbox", {name: "Name"});
    this.userName = page.getByRole('textbox', { name: 'user-name' });
    this.password = page.getByRole('textbox', { name: 'password' });
    */

    /*
     *
     * For the elements of the type 'button' and 'submit' are matched by their 'value' instead of the text content
     * For example, locating by text "Log in" matches <input type=button value="Log in">
     * And in this example using the textBox, the textContent for username and password is empty, this is why we cannot use getByText
     * this.userName = page.getByText("Username");
     * this.password = page.getByText("Password");
     */

    /*
    //Allows locating input elements by the text of the associated <label> or aria-labelledby element, or by the aria-label attribute
    this.userName = page.getByLabel('Username');
    this.password = page.getByLabel('Password');
    */

    /*
    //By default, the data-testid attribute is used as a test id.
    this.userName = page.getByTestId('Username');
    this.password = page.getByTestId('Password');
*/
    /*
    this.userName = page.locator('input#user-name');
    this.password = page.locator('input#password');
*/
    /*
    this.userName = page.locator("input[name='user-name']");
    this.password = page.locator("input[name='password']");
*/
    this.buttonLogin = page.getByRole('button', { name: 'Login' });
    /*
    this.buttonLogin = page.getByText('Login');
    this.buttonLogin = page.getByTestId('Login');
    this.buttonLogin = page.locator('input#login-button');
*/
    this.errorMessage = page.locator("h3[data-test='error']");
    //  this.errorMessage = page.getByTestId('error');
  }

  async loginUI(userEmail: string, password: string) {
    await this.userName.fill(userEmail);
    await this.password.fill(password);
    await this.buttonLogin.click();
  }

  async verifyPageOpened() {
    await expect(this.page).toHaveURL(/.*inventory/);
    await expect(this.page).toHaveTitle(/Swag Labs/);
  }

  async checkInvalidCredentials() {
    await expect(this.errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service');
  }
}
