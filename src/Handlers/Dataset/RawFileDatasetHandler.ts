import {FileDatasetHandler} from './FileDatasetHandler';
import {Dataset} from '../../Models/Dataset';

/**
 * Dataset that can handle CSV files
 */
export class RawFileDatasetHandler extends FileDatasetHandler {
  /**
   * Indicates if this handler can handle the described Dataset object
   * @param {Dataset} dataset Object that will be transformed as a
   *  CSVFileDataset
   * @return {boolean} True if this handler can handle the provided object
   */
  static canHandle(dataset: Dataset): boolean {
    return dataset &&
      dataset.name != undefined &&
      FileDatasetHandler.checkParseAs(dataset, 'raw');
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
   * @param {any} _options Options to pass to the csv library
   */
  private async parse(
      data: string, _options?: any): Promise<any> {
    return data;
  }
};
