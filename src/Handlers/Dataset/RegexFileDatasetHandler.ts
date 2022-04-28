import {FileDatasetHandler} from './FileDatasetHandler';
import {Dataset} from '../../Models/Dataset';
import {BebarHandlerContext} from '../Bebar/BebarHandlerContext';

/**
 * Dataset that can handle CSV files
 */
export class RegexFileDatasetHandler extends FileDatasetHandler {
  /**
   * Indicates if this handler can handle the described Dataset object
   * @param {Dataset} dataset Object that will be transformed as a
   *  CSVFileDataset
   * @return {boolean} True if this handler can handle the provided object
   */
  static canHandle(dataset: Dataset): boolean {
    const regexDefined = dataset !== null &&
      dataset !== undefined &&
      dataset.options !== null &&
      dataset.options !== undefined &&
      dataset.options.regex !== null &&
      dataset.options.regex !== undefined;
    return FileDatasetHandler.checkParseAs(dataset, 'regex') && regexDefined;
  }

  /**
   * Reads data from the source
   * @param {BebarHandlerContext} ctx The bebar execution context
   * @return {any} The data extracted from the source
   */
  async load(ctx: BebarHandlerContext): Promise<any> {
    this.parser = this.parse;
    return await super.loadData(ctx, undefined);
  }

  /**
   * Parses the content of the file
   * @param {string} data The data to parse
   * @param {any} options Options to pass to the csv library
   */
  private async parse(
      data: string, options?: any): Promise<any> {
    return data.match(options.regex);
  }
};
