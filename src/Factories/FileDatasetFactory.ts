import {FileDatasetHandler} from '../Handlers/Dataset/FileDatasetHandler';
import {FileDatasetHandlerTypes}
  from '../Handlers/Dataset/FileDatasetHandlerTypes';
import {Dataset} from '../Models/Dataset';
import {Factory} from './Factory';

/**
 * Class that can transform an object into a specialized Dataset class instance
 * Example: an object that contains a property `file` that ends
 * with a .json extension will produce a JSonDataset instance from that object.
 */
export class FileDatasetFactory extends Factory<Dataset, FileDatasetHandler> {
  /**
   * Constructor
   * @param {any} source Source data object with no type (yet)
   */
  constructor(
    public dataset: Dataset) {
    super(FileDatasetHandlerTypes, dataset);
  }
};
