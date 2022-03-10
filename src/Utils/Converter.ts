import {Dataset} from './../Models/Dataset';
import {Helperset} from './../Models/Helperset';
import {Partialset} from './../Models/Partialset';
import {Template} from './../Models/Template';
import {Iterator} from './../Models/Iterator';

import {IDataset} from './../Models/Interfaces/IDataset';
import {IHelperset} from './../Models/Interfaces/IHelperset';
import {IPartialset} from './../Models/Interfaces/IPartialset';
import {ITemplate} from './../Models/Interfaces/ITemplate';
import {IIterator} from './../Models/Interfaces/IIterator';

/**
 * Converter utility class
 */
export class Converter {
  /**
   * Transforms a plain object into an array of instances of Dataset
   * @param {(IDataset | string)[] | string | undefined} obj The object to
   *  transform
   * @return {Dataset[] | undefined} An array of Dataset object instances
   */
  public static toDatasets(obj: (IDataset | string)[] | string | undefined):
    Dataset[] | undefined {
    if (!obj) return undefined;
    if (typeof(obj) === 'string') return [new Dataset({file: obj})];
    return obj.map((o: any) => typeof(o) === 'string' ?
      new Dataset({file: o}) :
      new Dataset(o as IDataset));
  }

  /**
   * Transforms a plain object into an array of instances of Partialset
   * @param {(IPartialset | string)[] | string | undefined} obj The object to
   *  transform
   * @return {Partialset[] | undefined} An array of Dataset object instances
   */
  public static toPartialsets(
      obj: (IPartialset | string)[] | string | undefined):
    Partialset[] | undefined {
    if (!obj) return undefined;
    if (typeof(obj) === 'string') return [new Partialset({file: obj})];
    return obj.map((o: any) => typeof(o) === 'string' ?
      new Partialset({file: o}) :
      new Partialset(o as IPartialset));
  }

  /**
   * Transforms a plain object into an array of instances of Helperset
   * @param {(IHelperset | string)[] | string | undefined} obj The object to
   *  transform
   * @return {Helperset[] | undefined} An array of Helperset object instances
   */
  public static toHelpersets(obj: (IHelperset | string)[] | string | undefined):
    Helperset[] | undefined {
    if (!obj) return undefined;
    if (typeof(obj) === 'string') return [new Helperset({file: obj})];
    return obj.map((o: any) => typeof(o) === 'string' ?
      new Helperset({file: o}) :
      new Helperset(o as IHelperset));
  }

  /**
   * Transforms a plain object into an array of instances of Helperset
   * @param {ITemplate[] | undefined} obj The object to transform
   * @return {Helperset[] | undefined} An array of Helperset object instances
   */
  public static toTemplates(obj: ITemplate[] | undefined):
    Template[] | undefined {
    if (!obj) return obj;
    return obj.map((o: ITemplate) => new Template(o));
  }

  /**
   * Transforms a plain object into an array of instances of Iterator
   * @param {(IIterator | string)[] | string | undefined} obj The object to
   *  transform
   * @return {Iterator[] | undefined} An array of IteratorIterator object
   *  instances
   */
  public static toIterators(obj: (IIterator | string)[] | string | undefined):
   Iterator[] | undefined {
    if (!obj) return undefined;
    if (typeof(obj) === 'string') return [new Iterator({variable: obj})];
    return obj.map((o: any) => typeof(o) === 'string' ?
     new Iterator({variable: o}) :
     new Iterator(o as IIterator));
  }
}
