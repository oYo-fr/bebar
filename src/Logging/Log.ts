import {LogLevel} from './LogLevel';

/**
 * Represents one log
 */
export class Log {
  /**
   * Constructor.
   * @param {LogLevel} level The level of the log
   * @param {any} sender Where the message comes from
   * @param {string} message The log message
   * @param {any | undefined} error The error attached to the log (if any)
   * @param {string | undefined} symbol The emoji symbol of the message (if any)
   */
  public constructor(
    public level: LogLevel,
    public sender: any,
    public message: string,
    public error: any | undefined = undefined,
    public symbol: string | undefined = undefined) { }
}
