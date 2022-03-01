import {Settings} from '../Utils/Settings';
import {Log} from './Log';
import {LogLevel} from './LogLevel';

/**
 * Singleton class to the axio and be able to mock it
 */
export class Logger {
  private static logs: Log[] = [];

  /**
   * Constructor
   */
  private constructor() { }

  /**
   * Clear all logs
   */
  public static clear() {
    Logger.logs = [];
  }

  /**
   * Produce a log and show it if requested.
   * @param {any} sender Where the message comes from
   * @param {string} message The log message
   * @param {string} symbol The emoji symbol of the message (if any)
   */
  public static info(
      sender: any,
      message: string,
      symbol: string | undefined = undefined) {
    Logger.logs.push(Logger.showLog(
        new Log(LogLevel.INFO, sender, message, undefined, symbol)));
  }

  /**
   * Produce a log and show it if requested.
   * @param {any} sender Where the message comes from
   * @param {string} message The log message
   * @param {string} symbol The emoji symbol of the message (if any)
   * @param {any} error The error attached to the log (if any)
   */
  public static warn(
      sender: any,
      message: string,
      symbol: string | undefined = undefined,
      error: any | undefined = undefined) {
    Logger.logs.push(Logger.showLog(
        new Log(LogLevel.WARN, sender, message, error, symbol)));
  }

  /**
   * Produce a log and show it if requested.
   * @param {any} sender Where the message comes from
   * @param {string} message The log message
   * @param {any} error The error attached to the log (if any)
   * @param {string | undefined} symbol The emoji symbol of the message (if any)
   */
  public static error(
      sender: any,
      message: string,
      error: any,
      symbol: string | undefined = undefined) {
    Logger.logs.push(Logger.showLog(
        new Log(LogLevel.ERROR, sender, message, error, symbol)));
  }

  /**
   * Displays the log in the console
   * @param {Log} log The log to display
   * @return {Log} The displayed log
   */
  private static showLog(log: Log) : Log {
    if (Settings.verbosity && log.level >= Settings.verbosity) {
      console.log(log.message);
    }
    return log;
  }
}
