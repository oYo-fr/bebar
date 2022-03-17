import {IOutput} from './Interfaces/IOutput';

/**
 * Represents a produced file output
 */
export class Output {
  /** The resulting file content */
  public content: string = '';

  /** The final name of the file to write */
  public file: string | undefined;

  /** The data that was used to produce the output */
  public data: any | undefined;

  /**
   * Constructor.
   * @param {IOutput | undefined} plainObject A plain object containing
   */
  constructor(plainObject: IOutput | undefined) {
    if (plainObject) {
      this.content = plainObject.content;
      this.file = plainObject.file;
      this.data = plainObject.data;
    }
  }
};
