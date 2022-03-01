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
   * Gets the unique instance of Axios
   * @return {AxiosInstance} The instance of axios
   */
  public static getInstance(): AxiosInstance {
    if (!AxiosInstance.instance) {
      AxiosInstance.instance = new AxiosInstance();
    }

    return AxiosInstance.instance;
  }
}
