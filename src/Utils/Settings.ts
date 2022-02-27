/**
 * Singleton class to hold settings
 */
export class Settings {
  private static instance: Settings;
  public workingDirectory: string = '.';

  /**
   * Constructor
   */
  private constructor() { }

  /**
   * Gets the unique instance of settings
   * @return {Settings} The instance of settings
   */
  public static getInstance(): Settings {
    if (!Settings.instance) {
      Settings.instance = new Settings();
    }

    return Settings.instance;
  }
}
