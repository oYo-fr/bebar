export class BebarHandlerContext {
  /**
   * Constructor.
   * @param {string} rootPath The folder where the bebar file is
   * @param {string} filename The name of the bebar file
   *  partials from
   */
  constructor(
    public rootPath: string,
    public filename: string) {
  }
}
