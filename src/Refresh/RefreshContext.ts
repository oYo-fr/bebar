import {RefreshType} from './RefreshType';

/**
 * Object used to handle refresh.
 * Contains objects that have been refreshed, files that changed, ...
 */
export class RefreshContext {
  public refreshedObjects: any[] = [];

  /**
   * Constructor
   * @param {RefreshType} refreshType Indicates what kind of changed has occured
   * @param {string} rootPath The folder where the bebar file is
   * @param {string} oldFilePath The old file path. Should be undefined if the
   *  file has been created.
   * @param {string} newFilePath The new file path. Should be undefined if the
   *  file has been deleted.
   */
  constructor(
    public refreshType: RefreshType,
    public rootPath: string,
    public oldFilePath: string | undefined,
    public newFilePath: string | undefined,
    public newFileContent: string | undefined) {

  }
}
