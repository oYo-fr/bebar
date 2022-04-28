import {Dataset} from '../../Models/Dataset';
import {BebarHandlerContext} from '../Bebar/BebarHandlerContext';
import {FileDatasetHandler} from './FileDatasetHandler';

/**
 * Dataset that can handle JSon files
 */
export class JSonFileDatasetHandler extends FileDatasetHandler {
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
   * @param {BebarHandlerContext} ctx The bebar execution context
   * @return {any} The data extracted from the source
   */
  async load(ctx: BebarHandlerContext): Promise<any> {
    this.parser = JSON.parse;
    return await this.loadData(ctx, undefined);
  }
};
