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
  * @param {string} rootPath The folder where the bebar file is
  * @return {any} The data extracted from the source
  */
  async load(rootPath: string): Promise<any> {
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
        factory.load(rootPath);
        if (factory.handler) {
          await factory.handler.load(rootPath);
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
      for (let i = 0; i < this.bebar.helpers.length; i++) {
        const helper = this.bebar.helpers[i];
        const helperHandler = new HelpersetHandler(helper);
        await helperHandler.load(rootPath);
        this.helpersetHandlers.push(helperHandler);
      }
      for (let i = 0; i < this.templateHandlers.length; i++) {
        const templateHandler = this.templateHandlers[i];
        for (let j = 0; j < this.helpersetHandlers.length; j++) {
          const helperHandler = this.helpersetHandlers[j];
          helperHandler.registerHelpers(templateHandler.handlebars);
        }
      }
    }
    if (this.bebar.partials) {
      for (let i = 0; i < this.bebar.partials.length; i++) {
        const partial = this.bebar.partials[i];
        const partialHandler = new PartialsetHandler(partial);
        await partialHandler.load(rootPath);
        this.partialsetHandlers.push(partialHandler);
      }

      for (let i = 0; i < this.templateHandlers.length; i++) {
        const templateHandler = this.templateHandlers[i];
        for (let j = 0; j < this.partialsetHandlers.length; j++) {
          const partialsetHandler = this.partialsetHandlers[j];
          partialsetHandler.registerPartials(templateHandler.handlebars);
        }
      }
    }
    if (this.bebar.templates) {
      for (let i = 0; i < this.templateHandlers.length; i++) {
        const templateHandler = this.templateHandlers[i];
        templateHandler.bebarData = {
          ...this.allData,
        };
        await templateHandler.load(rootPath);
      }
    }
  }
};
