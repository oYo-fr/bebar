import {DatasetFactory} from '../../Factories/DatasetFactory';
import {Bebar} from '../../Models/Bebar';
import {DatasetHandler} from '../Dataset/DatasetHandler';
import {HelpersetHandler} from '../Helper/HelpersetHandler';
import {PartialsetHandler} from '../Partialset/PartialsetHandler';
import {TemplateHandler} from '../Template/TemplateHandler';
import Handlebars from 'handlebars';

/**
 * A bebar handler is reponsible for loading everything that migh be
 * set within a bebar file
 */
export class BebarHandler {
  public datasetHandlers: DatasetHandler[] = [];
  public partialsetHandlers: PartialsetHandler[] = [];
  public helpersetHandlers: HelpersetHandler[] = [];
  public templateHandlers: TemplateHandler[] = [];
  private allData: any = {};

  /**
   * Constructor.
   * @param {Bebar} Bebar Object that describes where to get the
   *  partials from
   */
  constructor(
    public bebar: Bebar) {
  }

  /**
  * Reads data from the source
  * @param {ParserFunction} parser Method to parse file content
  * @return {any} The data extracted from the source
  */
  async load(): Promise<any> {
    if (this.bebar.templates) {
      for (let i = 0; i < this.bebar.templates.length; i++) {
        const template = this.bebar.templates[i];
        const templateHandler = new TemplateHandler(
            template,
            Handlebars.create());
        this.templateHandlers.push(templateHandler);
      }
    }
    if (this.bebar.data) {
      this.allData = {};
      for (let i = 0; i < this.bebar.data.length; i++) {
        const data = this.bebar.data[i];
        const factory = new DatasetFactory(data);
        factory.load();
        if (factory.handler) {
          await factory.handler.load();
          this.datasetHandlers.push(factory.handler as DatasetHandler);
          if (factory.handler) {
            this.allData = {
              ...this.allData,
              ...factory.handler.content,
            };
          }
        }
      };
    }
    if (this.bebar.helpers) {
      for (let i = 0; i < this.templateHandlers.length; i++) {
        const templateHandler = this.templateHandlers[i];
        for (let i = 0; i < this.bebar.helpers.length; i++) {
          const helper = this.bebar.helpers[i];
          const helperHandler = new HelpersetHandler(
              helper,
              templateHandler.handlebars);
          await helperHandler.load();
          this.helpersetHandlers.push(helperHandler);
        }
      }
    }
    if (this.bebar.partials) {
      for (let i = 0; i < this.templateHandlers.length; i++) {
        const templateHandler = this.templateHandlers[i];
        for (let i = 0; i < this.bebar.partials.length; i++) {
          const partial = this.bebar.partials[i];
          const partialHandler = new PartialsetHandler(
              partial,
              templateHandler.handlebars);
          await partialHandler.load();
          this.partialsetHandlers.push(partialHandler);
        }
      }
    }
    if (this.bebar.templates) {
      for (let i = 0; i < this.templateHandlers.length; i++) {
        const templateHandler = this.templateHandlers[i];
        templateHandler.bebarData = {
          ...this.allData,
        };
        await templateHandler.load();
      }
    }
  }
};
