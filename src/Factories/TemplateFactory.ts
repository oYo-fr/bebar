import {ITemplate} from '../Models/Interfaces/ITemplate';
import {Template} from '../Models/Template';
import {Converter} from '../Utils/Converter';

/**
 * Factory class to create template objects
 */
export class TemplateFactory {
  /**
   * Creates a Template from a ITemplate
   * @param {ITemplate} plainObject The plain object to transform
   *  into an instance of a Template
   * @return {Template} An instance of a Template
   */
  public static create(plainObject: ITemplate): Template {
    const template = new Template(plainObject);
    template.data = Converter.toDatasets(plainObject.data);
    template.iterators = Converter.toIterators(plainObject.iterators);
    template.partials = Converter.toPartialsets(plainObject.partials);
    template.helpers = Converter.toHelpersets(plainObject.helpers);
    return template;
  }
}
