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
   * @param {(IDataset | string)[] | IDataset | string | undefined} obj
   *  The object to transform
   * @return {Dataset[]} An array of Dataset object instances
   */
  public static toDatasets(
      obj: (IDataset | string)[] | IDataset | string | undefined):
    Dataset[] {
    if (!obj) return [];
    if (typeof(obj) === 'string') return [new Dataset({file: obj})];
    return Array.isArray(obj) ?
      obj.map((o: any) => typeof(o) === 'string' ?
      new Dataset({file: o}) :
      new Dataset(o)) :
      [new Dataset(obj)];
  }

  /**
   * Transforms a plain object into an array of instances of Partialset
   * @param {(IPartialset | string)[] | IPartialset | string | undefined}
   *  obj The object to transform
   * @return {Partialset[]} An array of Partialset object instances
   */
  public static toPartialsets(
      obj: (IPartialset | string)[] | IPartialset | string | undefined):
    Partialset[] {
    if (!obj) return [];
    if (typeof(obj) === 'string') return [new Partialset({file: obj})];
    return Array.isArray(obj) ?
      obj.map((o: any) => typeof(o) === 'string' ?
      new Partialset({file: o}) :
      new Partialset(o)) :
      [new Partialset(obj)];
  }

  /**
   * Transforms a plain object into an array of instances of Helperset
   * @param {(IHelperset | string)[] | IHelperset | string | undefined} obj
   *  The object to transform
   * @return {Helperset[]} An array of Helperset object instances
   */
  public static toHelpersets(
      obj: (IHelperset | string)[] | IHelperset | string | undefined):
    Helperset[] {
    if (!obj) return [];
    if (typeof(obj) === 'string') return [new Helperset({file: obj})];
    return Array.isArray(obj) ?
      obj.map((o: any) => typeof(o) === 'string' ?
      new Helperset({file: o}) :
      new Helperset(o)) :
      [new Helperset(obj)];
  }

  /**
   * Transforms a plain object into an array of instances of Helperset
   * @param {ITemplate[] | ITemplate} obj The object to transform
   * @return {Template[]} An array of Template object instances
   */
  public static toTemplates(obj: ITemplate[] | ITemplate | undefined):
    Template[] {
    if (!obj) return [];
    return Array.isArray(obj) ? obj.map((o: ITemplate) => Converter.toTemplate(o)) : [Converter.toTemplate(obj)];
  }

  /**
   * Transforms a plain object into an instance of Helperset
   * @param {ITemplate} obj The object to transform
   * @return {Template} An instance of Template
   */
  private static toTemplate(obj: ITemplate): Template {
    const template = new Template(obj);
    template.data = Converter.toDatasets(obj.data);
    template.iterators = Converter.toIterators(obj.iterators);
    template.partials = Converter.toPartialsets(obj.partials);
    template.helpers = Converter.toHelpersets(obj.helpers);
    return template;
  }

  /**
   * Transforms a plain object into an array of instances of Iterator
   * @param {(IIterator | string)[] | IIterator | string | undefined} obj
   *  The object to transform
   * @return {Iterator[]} An array of IteratorIterator object
   *  instances
   */
  public static toIterators(
      obj: (IIterator | string)[] | IIterator | string | undefined):
   Iterator[] {
    if (!obj) return [];
    if (typeof(obj) === 'string') return [new Iterator({variable: obj})];
    return Array.isArray(obj) ?
      obj.map((o: any) => typeof(o) === 'string' ?
      new Iterator({variable: o}) :
      new Iterator(o)) :
      [new Iterator(obj)];
  }
}
