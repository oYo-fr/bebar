import {IBebar} from './Interfaces/IBebar';
import {Dataset} from './Dataset';
import {Template} from './Template';
import {Partialset} from './Partialset';
import {Helperset} from './Helperset';
import {Converter} from './../Utils/Converter';

/**
 * Top class that contains everything a bebar file can handle
 */
export class Bebar implements IBebar {
  /** The list of data that will be available for all templates */
  public data: Dataset[] | undefined = [];

  /** The list of files containing partial mustache templates */
  public partials: Partialset[] | undefined = [];

  /** The list of files containing helper functions */
  public helpers: Helperset[] | undefined = [];

  /** The list of files containing the mustache templates */
  public templates: Template[] | undefined = [];

  /**
   * Constructor.
   * @param {IBebar | undefined} plainObject A plain object containing
   *  required properties
   */
  constructor(plainObject: IBebar | undefined) {
    if (plainObject) Converter.toBebar(plainObject, this);
  }
};
