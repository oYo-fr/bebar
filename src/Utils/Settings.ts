import {LogLevel} from '../Logging/LogLevel';

/**
 * Singleton class to hold settings
 */
export class Settings {
  public static workingDirectory: string = '.';
  public static verbosity: LogLevel | undefined = undefined;

  /**
   * Constructor
   */
  private constructor() { }
}
