/**
 * Context handler class to hold paths, settings, ...
 */
export class BebarHandlerContext {
  /**
   * Constructor.
   * @param {string} rootPath The folder where the bebar file is
   * @param {string} filename The name of the bebar file
   *  partials from
   * @param {any} bebarHandlebarsContext The directory where to write outputs
   * @param {string} cachePath The directory where to store cache data
   * @param {string} outputPath The directory where to write outputs
   */
  constructor(
    public rootPath: string,
    public filename: string,
    public bebarHandlebarsContext: any,
    public cachePath: string = rootPath,
    public outputPath: string = rootPath) {
  }
}
