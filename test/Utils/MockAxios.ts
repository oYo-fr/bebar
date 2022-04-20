import {AxiosInstance} from '../../src/Utils/AxiosInstance';
import MockAdapter from 'axios-mock-adapter';
import fs from 'fs';
import util from 'util';
const readFile = util.promisify(fs.readFile);

/**
 * Helper class to mock axios library
 */
export abstract class MockAxios {
  private static mockAxiosInstance: MockAdapter = new MockAdapter(AxiosInstance.getInstance().axios);

  /**
   * Mocks a specific url to return a file content
   * @param {string} url The url to mock
   * @param {string} file The file to read and to return for the givent url
   */
  public static async mockUrl(url: string, file: string) {
    const fileContent = await readFile(file, 'utf-8');
    // @ts-ignore
    AxiosInstance.getInstance().axios = MockAxios.mockAxiosInstance;
    MockAxios.mockAxiosInstance.onAny(url).reply(200, fileContent);
  }

  /**
   * Reset
   */
  public static reset() {
    MockAxios.mockAxiosInstance.reset();
  }
}
