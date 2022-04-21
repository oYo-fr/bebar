import {Dataset} from '../../Models/Dataset';

/**
 * Generic Dataset handler class
 * A dataset handler is reponsible for reading and returning data
 * and emitting events when necessary
 */
export abstract class DatasetHandler {
  public key: string | undefined;

  /**
   * Constructor.
   * @param {Dataset} Dataset Object that describes where to get the data from
   */
  constructor(
    public dataset: Dataset,
    public content: any = undefined) {
  }

  /**
   * Returns true if the dataset parseAs property of the file extension is
   * equal to a certain value
   * @param {Dataset} dataset The dataset to check the value from
   * @param {string} expectedValue The expected file type
   * @return {boolean} True if the property parseAs of the file extension of a
   * file is equal to a certain value
   */
  protected static checkParseAs(
      dataset: Dataset,
      expectedValue: string,
  ): boolean {
    return dataset !== null && dataset !== undefined && (
      (dataset.parseAs != null &&
        dataset.parseAs != undefined &&
        dataset.parseAs.toLowerCase() === expectedValue));
  }

  /**
   * Load method to override
   * @param {string} _rootPath The folder where the bebar file is
   * */
  public load(_rootPath: string) {}
};
