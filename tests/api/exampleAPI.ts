import { APIRequestContext } from 'playwright';
import { expect } from '@playwright/test';
import { API_URL } from '../support/utils/config';

const apiContext = await APIRequestContext.newContext({ baseURL: API_URL });

export default class ExampleAPI {
  async getChapterAPI() {
    const contextRequest = await apiContext.newContext();
    const response = await contextRequest.get(API_URL + 'verses/nvi/sl/23', {});

    const responseCode = await response.status();
    const responseOk = await response.ok();

    return response;
    /*
    expect(response.status()).toBe(200);
    const responsebody = await response.json();
    const bibleBooks = responsebody.data.book

*/
  }

  async postChapterAPI(username: string, password: string) {
    const contextRequest = await apiContext.newContext();
    const response = await contextRequest.post(API_URL + 'verses/nvi/sl/23', {
      data: {
        username: username,
        password: password,
      },
    });
  }
  async postChapterVersionPayloadAPI(username: string, password: string) {
    const contextRequest = await apiContext.newContext();

    const response = await contextRequest.post(API_URL + 'verses/nvi/sl/23', {});
  }
}
