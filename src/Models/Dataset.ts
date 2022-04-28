import {IDataset} from './Interfaces/IDataset';
import {CachingOptions} from './CachingOptions';
import path from 'path';
const glob = require('glob');

/**
 * Generic Dataset class
 */
export class Dataset {
  /** Name that will be used within mustache */
  public name?: string | undefined;

  /** The file that contains the actual data */
  public file?: string | undefined;

  /** The encofing of the file that
   *  contains the data (defaults to UTF-8) */
  public encoding?: string | undefined;

  /** Options that may be passed to a
   *  dataset handler */
  public options?: any | undefined;

  /** Actual data within the bebar file for
   *  direct content */
  public content?: any | undefined;

  /** An object that could be passed to
   *  javascript functions */
  public context?: any | undefined;

  /** Strongly indicates how the file should
   *  be parsed */
  public parseAs?: any | undefined;

  /** The url of the file to get */
  public url?: string | undefined;

  /** Http options that can be used to
   *  specify method (GET, POST, ...), headers, ... */
  public httpOptions?: any | undefined;

  /** The caching options for the dataset */
  public cache?: CachingOptions | undefined;

  /**
   * Constructor.
   * @param {Dataset | undefined} plainObject A plain object containing required properties
   */
  constructor(plainObject: IDataset | undefined) {
    if (plainObject) {
      this.name = plainObject.name;
      this.file = plainObject.file;
      this.encoding = plainObject.encoding;
      this.options = plainObject.options;
      this.content = plainObject.content;
      this.context = plainObject.context;
      this.parseAs = plainObject.parseAs;
      this.url = plainObject.url;
      this.httpOptions = plainObject.httpOptions;
      this.cache = plainObject.cache ? new CachingOptions(plainObject.cache) : undefined;
    }
    this.setDefaults();
  }

  /**
   * Sets default values where it's needed
   */
  public setDefaults() {
    this.name = (!this.name || this.name === '') &&
        this.file &&
        this.file !== '' &&
        !this.multipleFiles(this.file) ?
        path.parse(this.file).name : this.name;
    this.encoding = (this.file && !this.encoding) ? 'utf-8' : this.encoding;
    if (this.url != null && this.url != undefined &&
        (this.httpOptions === null || this.httpOptions === undefined)) {
      this.httpOptions = {
        method: 'GET',
      };
    }
  }

  /**
   * Tells if the given path contains a wildcard and if the result of this
   * is multiple files
   * @param {sring} p The path to check
   * @return {boolean} True if the path contains a wildcard and gives multiple
   *  files
   */
  private multipleFiles(p: string): boolean {
    return glob.sync(path.resolve('.', p)).length > 1;
  }
};
