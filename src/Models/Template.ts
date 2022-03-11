import {Dataset} from './Dataset';
import {Iterator} from './Iterator';
import {ITemplate} from './Interfaces/ITemplate';
import {Partialset} from './Partialset';
import {Helperset} from './Helperset';

/**
 * Generic Template class
 */
export class Template {
  /** The file that contains the actual template */
  public file?: string | undefined;

  /** The encofing of the file that */
  public encoding?: string | undefined;

  /** The url of the file that
   *  contains the template */
  public url?: string | undefined;

  /** Http options that can be used to
   *  specify method (GET, POST, ...), headers, ... */
  public httpOptions?: any | undefined;

  /** Actual template content within the
   *  bebar file */
  public content?: string | undefined;

  /** The datasets specific to the template */
  public data?: Dataset[] | undefined;

  /** The list of files containing partial mustache templates */
  public partials: Partialset[] | undefined = [];

  /** The list of files containing helper functions */
  public helpers: Helperset[] | undefined = [];

  /** The file(s) where the output should be
   *  produced. This can be a handlebars template */
  public output?: string | undefined;

  /** A list of iterators to loop
   *  through when processing the outputs */
  public iterators?: Iterator[] | undefined;

  /** Indicates the name of the
   *  property where the current iteration will be found within the data. If not
   *  set, iteration values will be pushed at the root of the data passed to the
   *  template */
  public iterationValueName?: string | undefined;

  /** Pretify options to use on output */
  public prettify?: any | undefined;
  /**
   * Constructor.
   * @param {ITemplate | undefined} plainObject A plain object containing
   */
  constructor(plainObject: ITemplate | undefined) {
    if (plainObject) {
      this.file = plainObject.file;
      this.encoding = plainObject.encoding;
      this.url = plainObject.url;
      this.httpOptions = plainObject.httpOptions;
      this.content = plainObject.content;
      this.output = plainObject.output;
      this.iterationValueName = plainObject.iterationValueName;
      this.prettify = plainObject.prettify;
    }
    this.setDefaults();
  }

  /**
   * Sets default values where it's needed
   */
  public setDefaults() {
    this.encoding = (this.file && !this.encoding) ? 'utf-8' : this.encoding;
  }
};
