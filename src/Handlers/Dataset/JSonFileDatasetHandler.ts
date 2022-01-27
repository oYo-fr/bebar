import {Dataset} from '../../Models/Dataset';
import {FileDatasetHandler} from './FileDatasetHandler';

/**
 * Dataset that can handle JSon files
 */
export class JSonFileDatasetHandler
  extends FileDatasetHandler {
  /**
   * Indicates if this handler can handle the described Dataset object
   * @param {Dataset} dataset Object that will be transformed as a
   *  JSonFileDataset
   * @return {boolean} True if this handler can handle the provided object
   */
  static canHandle(dataset: Dataset): boolean {
    return FileDatasetHandler.checkParseAsOrFileExtension(dataset, 'json');
  }

  /**
   * Reads data from the source
   * @return {any} The data extracted from the source
   */
  async load(): Promise<any> {
    return await super.loadWithParser(JSON.parse);
  }
};
