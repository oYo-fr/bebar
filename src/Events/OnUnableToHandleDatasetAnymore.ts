/**
 * Event that occurs when a dataset handler cannot handle
 * the source anymore
 */
export class OnUnableToHandleDatasetAnymore {
  /**
   * Constructor.
   * @param {any} sender The sender of the event
   */
  constructor(
    public sender: any) {
  }
}
