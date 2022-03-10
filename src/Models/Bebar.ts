import {IBebar} from './Interfaces/IBebar';
import {Converter} from '../Utils/Converter';
import {Dataset} from './Dataset';
import {Template} from './Template';
import {Partialset} from './Partialset';
import {Helperset} from './Helperset';

/**
 * Top class that contains everything a bebar file can handle
 */
export class Bebar {
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
    if (plainObject) {
      this.data = Converter.toDatasets(plainObject.data);
      this.partials = Converter.toPartialsets(plainObject.partials);
      this.helpers = Converter.toHelpersets(plainObject.helpers);
      this.templates = Converter.toTemplates(plainObject.templates);
    }
  }
};
