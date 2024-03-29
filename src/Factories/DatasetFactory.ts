import {DatasetHandler} from '../Handlers/Dataset/DatasetHandler';
import {AllDatasetHandlerTypes}
  from '../Handlers/Dataset/AllDatasetHandlerTypes';
import {Dataset} from '../Models/Dataset';
import {Factory} from './Factory';

/**
 * Class that can transform an object into a specialized Dataset class instance
 * Example: an object that contains a property `file` that ends
 * with a .json extension will produce a JSonDataset instance from that object.
 */
export class DatasetFactory extends Factory<Dataset, DatasetHandler> {
  /**
   * Constructor
   * @param {any} source Source data object with no type (yet)
   */
  constructor(
    public dataset: Dataset) {
    super(AllDatasetHandlerTypes, dataset);
  }
};
