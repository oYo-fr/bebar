import {IBebar} from './Interfaces/IBebar';
import {Converter} from '../Utils/Converter';
import {Dataset} from './Dataset';
import {Template} from './Template';
import {Partialset} from './Partialset';
import {Helperset} from './Helperset';
import {TemplateFactory} from './../Factories/TemplateFactory';

/**
 * Top class that contains everything a bebar file can handle
 */
export class Bebar {
  /** The list of data that will be available for all templates */
  public data: Dataset[] = [];

  /** The list of files containing partial mustache templates */
  public partials: Partialset[] = [];

  /** The list of files containing helper functions */
  public helpers: Helperset[] = [];

  /** The list of files containing the mustache templates */
  public templates: Template[] = [];

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
      if (plainObject.templates) {
        if (Array.isArray(plainObject.templates)) {
          for (let i = 0; i < plainObject.templates.length; i++) {
            const plainTemplate = plainObject.templates[i];
            const template = TemplateFactory.create(plainTemplate);
            template.data = Converter.toDatasets(plainTemplate.data);
            template.iterators = Converter.toIterators(plainTemplate.iterators);
            template.partials = Converter.toPartialsets(plainTemplate.partials);
            template.helpers = Converter.toHelpersets(plainTemplate.helpers);
            this.templates.push(template);
          }
        }
      }
      this.templates = Converter.toTemplates(plainObject.templates);
    }
  }
};
