/**
 * Event that occurs when something changes on an object
 */
export class OnChanged<T> {
  /**
   * Constructor.
   * @param {any} sender The sender of the event
   * @param {string} property The name of the property that has changed
   * @param {T} oldValue The previous value
   * @param {T} newValue The new value
   */
  constructor(
    public sender: any,
    public property: string,
    public oldValue: T,
    public newValue: T) {
  }
}
