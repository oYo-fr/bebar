import {Converter} from '../Utils/Converter';
import {IHelperset} from './Interfaces/IHelperset';

/**
 * Represents a place where handlebar helpers can be found.
 * A helper set can point to a single file, or a file pattern.
 */
export class Helperset implements IHelperset {
  /** The file that contains the helper functions */
  public file?: string | undefined;

  /** The encofing of the file that contains the helper functions
   * (defaults to UTF-8)
  */
  public encoding?: string | undefined;

  /** The url of the file to get */
  public url?: string | undefined;

  /** Http options that can be used to
   *  specify method (GET, POST, ...), headers, ...
   * */
  public httpOptions?: any | undefined;
  /**
   * Constructor.
   * @param {IHelperset | undefined} plainObject A plain object containing
   */
  constructor(plainObject: IHelperset | undefined) {
    if (plainObject) Converter.toHelperset(plainObject, this);
    this.setDefaults();
  }

  /**
   * Sets default values where it's needed
   */
  public setDefaults() {
    this.encoding = (this.file && !this.encoding) ? 'utf-8' : this.encoding;
    if (this.url != null && this.url != undefined &&
        (this.httpOptions === null || this.httpOptions === undefined)) {
      this.httpOptions = {
        method: 'GET',
      };
    }
  }
};
