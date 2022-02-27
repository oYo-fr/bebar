import {Bebar} from '../Models/Bebar';
import {Dataset} from '../Models/Dataset';
import {Helperset} from '../Models/Helperset';
import {IBebar} from '../Models/Interfaces/IBebar';
import {IDataset} from '../Models/Interfaces/IDataset';
import {IHelperset} from '../Models/Interfaces/IHelperset';
import {IIterator} from '../Models/Interfaces/IIterator';
import {IOutput} from '../Models/Interfaces/IOutput';
import {IPartialset} from '../Models/Interfaces/IPartialset';
import {ITemplate} from '../Models/Interfaces/ITemplate';
import {Iterator} from '../Models/Iterator';
import {Output} from '../Models/Output';
import {Partialset} from '../Models/Partialset';
import {Template} from '../Models/Template';

/**
 * Utility class to convert an object into an instance
 */
export class Converter {
  /**
   * Transforms a plain object into an instance of Bebar
   * @param {IBebar | undefined} obj The object to transform
   * @param {Bebar | undefined} instance The already existing instance of
   *  a the object to set the properties to
   * @return {Bebar} A bebar object instance
   */
  public static toBebar(
      obj: IBebar | undefined,
      instance: Bebar | undefined = undefined): Bebar | undefined {
    if (!obj) return obj;
    if (!instance) return new Bebar(obj);
    instance.data = Converter.toDatasets(obj.data);
    instance.partials = Converter.toPartialsets(obj.partials);
    instance.helpers = Converter.toHelpersets(obj.helpers);
    instance.templates = Converter.toTemplates(obj.templates);
    return instance;
  }

  /**
   * Transforms a plain object into an array of instances of Dataset
   * @param {IDataset[] | undefined} obj The object to transform
   * @return {Dataset[] | undefined} An array of Dataset object instances
   */
  public static toDatasets(obj: IDataset[] | undefined): Dataset[] | undefined {
    if (!obj) return obj;
    return obj.map((o: any) => Converter.toDataset(o) as Dataset);
  }

  /**
   * Transforms a plain object into an array of instances of Partialset
   * @param {IPartialset[] | undefined} obj The object to transform
   * @return {Partialset[] | undefined} An array of Dataset object instances
   */
  public static toPartialsets(obj: IPartialset[] | undefined):
    Partialset[] | undefined {
    if (!obj) return obj;
    return obj.map((o: any) => Converter.toPartialset(o) as Partialset);
  }

  /**
   * Transforms a plain object into an array of instances of Helperset
   * @param {IHelperset[] | undefined} obj The object to transform
   * @return {Helperset[] | undefined} An array of Helperset object instances
   */
  public static toHelpersets(obj: IHelperset[] | undefined):
    Helperset[] | undefined {
    if (!obj) return obj;
    return obj.map((o: any) => Converter.toHelperset(o) as Helperset);
  }

  /**
   * Transforms a plain object into an array of instances of Helperset
   * @param {ITemplate[] | undefined} obj The object to transform
   * @return {Helperset[] | undefined} An array of Helperset object instances
   */
  public static toTemplates(obj: ITemplate[] | undefined):
    Template[] | undefined {
    if (!obj) return obj;
    return obj.map((o: any) => Converter.toTemplate(o) as Template);
  }

  /**
   * Transforms a plain object into an array of instances of Iterator
   * @param {IIterator[] | undefined} obj The object to transform
   * @return {Iterator[] | undefined} An array of IteratorIterator object
   *  instances
   */
  public static toIterators(obj: IIterator[] | undefined):
    Iterator[] | undefined {
    if (!obj) return obj;
    return obj.map((o: any) => Converter.toIterator(o) as Iterator);
  }

  /**
   * Transforms a plain object into an instance of Dataset
   * @param {IDataset | undefined} obj The object to transform
   * @param {Dataset | undefined} instance The already existing instance of
   *  a the object to set the properties to
   * @return {Dataset | undefined} A Dataset object instance
   */
  public static toDataset(
      obj: IDataset | undefined,
      instance: Dataset | undefined = undefined): Dataset | undefined {
    if (!obj) return obj;
    if (!instance) return new Dataset(obj);
    instance.name = obj.name;
    instance.file = obj.file;
    instance.encoding = obj.encoding;
    instance.options = obj.options;
    instance.content = obj.content;
    instance.context = obj.context;
    instance.parseAs = obj.parseAs;
    instance.url = obj.url;
    instance.httpOptions = obj.httpOptions;
    return instance;
  }

  /**
   * Transforms a plain object into an instance of Helperset
   * @param {IHelperset | undefined} obj The object to transform
   * @param {Helperset | undefined} instance The already existing instance of
   *  a the object to set the properties to
   * @return {Helperset | undefined} A Helperset object instance
   */
  public static toHelperset(
      obj: IHelperset | undefined,
      instance: Helperset | undefined = undefined):
    Helperset | undefined {
    if (!obj) return obj;
    if (!instance) return new Helperset(obj);
    instance.file = obj.file;
    instance.encoding = obj.encoding;
    instance.url = obj.url;
    instance.httpOptions = obj.httpOptions;
    return instance;
  }

  /**
   * Transforms a plain object into an instance of Partialset
   * @param {IPartialset | undefined} obj The object to transform
   * @param {Partialset | undefined} instance The already existing instance of
   *  a the object to set the properties to
   * @return {Partialset | undefined} A Partialset object instance
   */
  public static toPartialset(
      obj: IPartialset | undefined,
      instance: Partialset | undefined = undefined):
    Partialset | undefined {
    if (!obj) return obj;
    if (!instance) return new Partialset(obj);
    instance.name = obj.name;
    instance.file = obj.file;
    instance.encoding = obj.encoding;
    instance.url = obj.url;
    instance.httpOptions = obj.httpOptions;
    instance.content = obj.content;
    return instance;
  }

  /**
   * Transforms a plain object into an instance of Template
   * @param {ITemplate | undefined} obj The object to transform
   * @param {Template | undefined} instance The already existing instance of
   *  a the object to set the properties to
   * @return {Template | undefined} A Template object instance
   */
  public static toTemplate(
      obj: ITemplate | undefined,
      instance: Template | undefined = undefined): Template | undefined {
    if (!obj) return obj;
    if (!instance) return new Template(obj);
    instance.file = obj.file;
    instance.encoding = obj.encoding;
    instance.url = obj.url;
    instance.httpOptions = obj.httpOptions;
    instance.content = obj.content;
    instance.data = Converter.toDatasets(obj.data);
    instance.output = obj.output;
    instance.iterators = Converter.toIterators(obj.iterators);
    instance.iterationValueName = obj.iterationValueName;
    instance.prettify = obj.prettify;
    return instance;
  }

  /**
   * Transforms a plain object into an instance of Iterator
   * @param {IIterator | undefined} obj The object to transform
   * @param {Iterator | undefined} instance The already existing instance of
   *  a the object to set the properties to
   * @return {Iterator | undefined} A Iterator object instance
   */
  public static toIterator(
      obj: IIterator | undefined,
      instance: Iterator | undefined = undefined): Iterator | undefined {
    if (!obj) return obj;
    if (!instance) return new Iterator(obj);
    instance.variable = obj.variable;
    instance.array = obj.array;
    return instance;
  }

  /**
   * Transforms a plain object into an instance of Iterator
   * @param {IIterator | undefined} obj The object to transform
   * @param {Iterator | undefined} instance The already existing instance of
   *  a the object to set the properties to
   * @return {Iterator | undefined} A Iterator object instance
   */
  public static toOutput(
      obj: IOutput | undefined,
      instance: Output | undefined = undefined): Output | undefined {
    if (!obj) return obj;
    if (!instance) return new Output(obj);
    instance.content = obj.content;
    instance.file = obj.file;
    return instance;
  }
}
