import {IBebar} from './Interfaces/IBebar';
import {IDataset} from '../Models/Interfaces/IDataset';
import {IPartialset} from '../Models/Interfaces/IPartialset';
import {IHelperset} from '../Models/Interfaces/IHelperset';
import {ITemplate} from '../Models/Interfaces/ITemplate';
import {Dataset} from './Dataset';
import {Template} from './Template';
import {Partialset} from './Partialset';
import {Helperset} from './Helperset';

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
    if (plainObject) {
      this.data = this.toDatasets(plainObject.data);
      this.partials = this.toPartialsets(plainObject.partials);
      this.helpers = this.toHelpersets(plainObject.helpers);
      this.templates = this.toTemplates(plainObject.templates);
    }
  }

  /**
   * Transforms a plain object into an array of instances of Dataset
   * @param {IDataset[] | undefined} obj The object to transform
   * @return {Dataset[] | undefined} An array of Dataset object instances
   */
  private toDatasets(obj: IDataset[] | undefined): Dataset[] | undefined {
    if (!obj) return obj;
    return obj.map((o: IDataset) => new Dataset(o));
  }

  /**
   * Transforms a plain object into an array of instances of Partialset
   * @param {IPartialset[] | undefined} obj The object to transform
   * @return {Partialset[] | undefined} An array of Dataset object instances
   */
  private toPartialsets(obj: IPartialset[] | undefined):
    Partialset[] | undefined {
    if (!obj) return obj;
    return obj.map((o: IPartialset) => new Partialset(o));
  }

  /**
   * Transforms a plain object into an array of instances of Helperset
   * @param {IHelperset[] | undefined} obj The object to transform
   * @return {Helperset[] | undefined} An array of Helperset object instances
   */
  private toHelpersets(obj: IHelperset[] | undefined):
   Helperset[] | undefined {
    if (!obj) return obj;
    return obj.map((o: IHelperset) => new Helperset(o));
  }

  /**
   * Transforms a plain object into an array of instances of Helperset
   * @param {ITemplate[] | undefined} obj The object to transform
   * @return {Helperset[] | undefined} An array of Helperset object instances
   */
  private toTemplates(obj: ITemplate[] | undefined):
    Template[] | undefined {
    if (!obj) return obj;
    return obj.map((o: ITemplate) => new Template(o));
  }
};
