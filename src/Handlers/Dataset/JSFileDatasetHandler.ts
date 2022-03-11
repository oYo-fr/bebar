import {FileDatasetHandler} from './FileDatasetHandler';
import {Dataset} from '../../Models/Dataset';
const nodeEval = require('node-eval');

/**
 * Dataset that can handle JS files
 */
export class JSFileDatasetHandler
  extends FileDatasetHandler {
  /**
   * Indicates if this handler can handle the described Dataset object
   * @param {Dataset} dataset Object that will be transformed as a JSFileDataset
   * @return {boolean} True if this handler can handle the provided object
   */
  static canHandle(dataset: Dataset): boolean {
    return FileDatasetHandler.checkParseAsOrFileExtension(dataset, 'js') ||
      FileDatasetHandler.checkParseAs(dataset, 'javascript');
  }

  /**
   * Reads data from the source
   * @param {string} rootPath The folder where the bebar file is
   * @return {any} The data extracted from the source
   */
  async load(rootPath: string): Promise<any> {
    return await super.loadWithParser(this.parse, rootPath);
  }

  /**
   * Parses the content of the file
   * @param {string} data The data to parse
   * @param {any} options Options
   * @param {any} context Context
   * @param {string} rootPath The folder where the bebar file is
   */
  private async parse(
      data: string,
      options?: any,
      context?: any,
      rootPath: string = '.'): Promise<any> {
    const param = {
      ...context,
      options: options,
    };
    let result = nodeEval(data, rootPath, param);
    try {
      result = await result(param);
    } catch {}
    return result;
  }
};
