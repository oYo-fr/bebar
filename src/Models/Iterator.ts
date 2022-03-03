import {IIterator} from './Interfaces/IIterator';

/**
 * Top class that contains everything a bebar file can handle
 */
export class Iterator {
  /** The name of the variable to use in the iteration result */
  public variable: string = '';

  /** The name of the array within the original object. Can be undefined in
   *  case of nested arrays */
  public array: string | undefined;

  /**
   * Constructor.
   * @param {IIterator | undefined} plainObject A plain object containing
   */
  constructor(plainObject: IIterator | undefined) {
    if (plainObject) {
      this.variable = plainObject.variable;
      this.array = plainObject.array;
    }
  }
};
