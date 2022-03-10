import {IDataset} from '../Models/Interfaces/IDataset';
import {IHelperset} from '../Models/Interfaces/IHelperset';
import {IPartialset} from '../Models/Interfaces/IPartialset';
import {IIterator} from '../Models/Interfaces/IIterator';

/**
 * Interface convert class
 */
export class InterfaceConverter {
  /**
   * Converts a string, an array of strings or IDatasets, or an undefined
   *  value into an array of IDataset
   * @param {string | (IDataset | string)[] | IDataset | undefined} value
   *  The value to convert
   * @return {IDataset[]} An array of IDatasets
   */
  public static toIDatasetArray(
      value: string | (IDataset | string)[] | IDataset | undefined)
      : IDataset[] {
    if (value === undefined) {
      return [];
    } else if (Array.isArray(value)) {
      return value.map((curValue) => typeof(curValue) === 'string' ?
      {file: curValue} as IDataset :
      curValue);
    } else if (typeof(value) === 'string') {
      return [{file: value} as IDataset];
    }
    return [value];
  }

  /**
   * Converts a string, an array of strings or IHelpersets, or an undefined
   *  value into an array of IHelperset
   * @param {string | (IHelperset | string)[] | IHelperset | undefined} value
   *  The value to convert
   * @return {IHelperset[]} An array of IHelpersets
   */
  public static toIHelpersetArray(
      value: string | (IHelperset | string)[] | IHelperset | undefined)
      : IHelperset[] {
    if (value === undefined) {
      return [];
    } else if (Array.isArray(value)) {
      return value.map((curValue) => typeof(curValue) === 'string' ?
      {file: curValue} as IHelperset :
      curValue);
    } else if (typeof(value) === 'string') {
      return [{file: value} as IHelperset];
    }
    return [value];
  }

  /**
   * Converts a string, an array of strings or IPartialsets, or an undefined
   *  value into an array of IPartialset
   * @param {string | (IPartialset | string)[] | IPartialset | undefined} value
   *  The value to convert
   * @return {IPartialset[]} An array of IPartialsets
   */
  public static toIPartialsetArray(
      value: string | (IPartialset | string)[] | IPartialset | undefined)
      : IPartialset[] {
    if (value === undefined) {
      return [];
    } else if (Array.isArray(value)) {
      return value.map((curValue) => typeof(curValue) === 'string' ?
      {file: curValue} as IPartialset :
      curValue);
    } else if (typeof(value) === 'string') {
      return [{file: value} as IPartialset];
    }
    return [value];
  }

  /**
   * Converts a string, an array of strings or IIterators, or an undefined
   *  value into an array of IIterator
   * @param {string | (IIterator | string)[] | IIterator | undefined} value
   *  The value to convert
   * @return {IIterator[]} An array of IIterators
   */
  public static toIIteratorArray(
      value: string | (IIterator | string)[] | IIterator | undefined)
      : IIterator[] {
    if (value === undefined) {
      return [];
    } else if (Array.isArray(value)) {
      return value.map((curValue) => typeof(curValue) === 'string' ?
      {variable: curValue} as IIterator :
      curValue);
    } else if (typeof(value) === 'string') {
      return [{variable: value} as IIterator];
    }
    return [value];
  }
}
