import {IOutput} from './Interfaces/IOutput';

/**
 * Represents a produced file output
 */
export class Output implements IOutput {
  /** The resulting file content */
  public content: string = '';

  /** The final name of the file to write */
  public file: string | undefined;
  /**
   * Constructor.
   * @param {IOutput | undefined} plainObject A plain object containing
   */
  constructor(plainObject: IOutput | undefined) {
    if (plainObject) {
      this.content = plainObject.content;
      this.file = plainObject.file;
    }
  }
};
