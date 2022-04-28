import {IPartialset} from './Interfaces/IPartialset';

/**
 * Represents a place where handlebar partials can be found.
 * A partial set can point to a single file, or a file pattern.
 */
export class Partialset {
  /** Name that will be used within mustache
   *  templates */
  public name?: string | undefined;

  /** The file that contains the actual data */
  public file?: string | undefined;

  /** The encofing of the file that
   *  contains the data */
  public encoding?: string | undefined;

  /** The url of the file to get */
  public url?: string | undefined;

  /** Http options that can be used to
   *  specify method (GET, POST, ...), headers, ... */
  public httpOptions?: any | undefined;

  /** Actual partial content */
  public content?: string | undefined;
  /**
   * Constructor.
   * @param {IPartialset | undefined} plainObject A plain object containing required properties
   */
  constructor(plainObject: IPartialset | undefined) {
    if (plainObject) {
      this.name = plainObject.name;
      this.file = plainObject.file;
      this.encoding = plainObject.encoding;
      this.url = plainObject.url;
      this.httpOptions = plainObject.httpOptions;
      this.content = plainObject.content;
    }
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
