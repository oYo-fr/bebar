import {Dataset} from './Dataset';
import {Iterator} from './Iterator';
import {ITemplate} from './Interfaces/ITemplate';
import {IIterator} from '../Models/Interfaces/IIterator';
import {IDataset} from '../Models/Interfaces/IDataset';

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
      this.data = this.toDatasets(plainObject.data);
      this.output = plainObject.output;
      this.iterators = this.toIterators(plainObject.iterators);
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

  /**
   * Transforms a plain object into an array of instances of Dataset
   * @param {any | undefined} obj The object to transform
   * @return {Dataset[] | undefined} An array of Dataset object instances
   */
  private toDatasets(obj: any | undefined):
    Dataset[] | undefined {
    if (!obj) return obj;
    if (typeof(obj) === 'string') return [new Dataset({file: obj})];
    return obj.map((o: any) => typeof(o) === 'string' ?
      new Dataset({file: o}) :
      new Dataset(o as IDataset));
  }

  /**
   * Transforms a plain object into an array of instances of Iterator
   * @param {IIterator[] | undefined} obj The object to transform
   * @return {Iterator[] | undefined} An array of IteratorIterator object
   *  instances
   */
  private toIterators(obj: IIterator[] | undefined):
   Iterator[] | undefined {
    if (!obj) return obj;
    return obj.map((o: IIterator) => new Iterator(o));
  }
};
