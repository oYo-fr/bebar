import Axios from 'axios';
/**
 * Singleton class to the axio and be able to mock it
 */
export class AxiosInstance {
  private static instance: AxiosInstance;
  public axios = Axios;

  /**
   * Constructor
   */
  private constructor() { }

  /**
   * Gets the unique instance of settings
   * @return {AxiosInstance} The instance of axio
   */
  public static getInstance(): AxiosInstance {
    if (!AxiosInstance.instance) {
      AxiosInstance.instance = new AxiosInstance();
    }

    return AxiosInstance.instance;
  }
}
