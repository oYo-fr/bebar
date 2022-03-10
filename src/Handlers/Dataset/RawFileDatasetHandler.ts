import {FileDatasetHandler} from './FileDatasetHandler';
import {Dataset} from '../../Models/Dataset';

/**
 * Dataset that can handle CSV files
 */
export class RawFileDatasetHandler
  extends FileDatasetHandler {
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
   * @return {any} The data extracted from the source
   */
  async load(): Promise<any> {
    return await super.loadWithParser(this.parse);
  }

  /**
   * Parses the content of the file
   * @param {string} data The data to parse
   */
  private async parse(data: string): Promise<any> {
    return data;
  }
};
