import {Dataset} from '../../Models/Dataset';
import {DatasetHandler} from './DatasetHandler';

/**
 * Generic Dataset handler class
 * A dataset handler is reponsible for reading and returning data
 * and emitting events when necessary
 */
export class DirectDatasetHandler extends DatasetHandler {
  /**
   * Indicates if this handler can handle the described Dataset object
   * @param {Dataset} dataset Object that will be transformed as a Dataset
   * @return {boolean} True if this handler can handle the provided object
   */
  static canHandle(dataset: Dataset): boolean {
    return dataset && dataset.content;
  }

  /**
   * Reads data from the source
   * @return {any} The data extracted from the source
   */
  async load(): Promise<any> {
    const instance = this;
    return new Promise((resolve) => {
      if (!instance.dataset.name) {
        instance.content = instance.dataset.content;
      } else {
        instance.key = instance.dataset.name as string;
        instance.content = {
          [instance.key]: instance.dataset.content,
        };
      }
      resolve(instance.content);
    });
  }
};
