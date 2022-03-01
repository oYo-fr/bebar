import {DatasetHandler} from '../Handlers/Dataset/DatasetHandler';
import {AllDatasetHandlerTypes}
  from '../Handlers/Dataset/AllDatasetHandlerTypes';
import {FileDatasetHandlerTypes}
  from '../Handlers/Dataset/FileDatasetHandlerTypes';
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
   * @param {Array<any>} allTypes Indicates if all dataset handler types should
   *  be tested or only file dataset handler types
   */
  constructor(
    public dataset: Dataset,
    allTypes: boolean = true) {
    super(allTypes ? AllDatasetHandlerTypes : FileDatasetHandlerTypes, dataset);
  }
};
