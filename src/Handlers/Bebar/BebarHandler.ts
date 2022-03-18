import {DatasetFactory} from '../../Factories/DatasetFactory';
import {Bebar} from '../../Models/Bebar';
import {DatasetHandler} from '../Dataset/DatasetHandler';
import {FileDatasetHandler} from '../Dataset/FileDatasetHandler';
import {HelpersetHandler} from '../Helper/HelpersetHandler';
import {PartialsetHandler} from '../Partialset/PartialsetHandler';
import {TemplateHandler} from '../Template/TemplateHandler';
import Handlebars from 'handlebars';
import {RefreshContext} from './../../Refresh/RefreshContext';
import {RefreshType} from '../../Refresh/RefreshType';
const YAML = require('yaml');
const deepEqual = require('deep-equal');

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
   * @param {string} rootPath The folder where the bebar file is
   * @param {string} filename The name of the bebar file
   *  partials from
   */
  constructor(
    public bebar: Bebar,
    public rootPath: string,
    public filename: string) {
  }

  /**
  * Reads data from the source
  * @return {any} The data extracted from the source
  */
  async load(): Promise<any> {
    await this.loadDatasets();
    this.compileData();
    await this.loadHelpers();
    await this.loadPartials();
    await this.loadTemplates();
  }

  /** Loads datasets */
  private async loadDatasets() {
    this.datasetHandlers = [];
    if (this.bebar.data) {
      for (let i = 0; i < this.bebar.data.length; i++) {
        const data = this.bebar.data[i];
        const factory = new DatasetFactory(data);
        factory.load(this.rootPath);
        if (factory.handler) {
          await factory.handler.load(this.rootPath);
          if (factory.handler) {
            this.datasetHandlers.push(factory.handler as DatasetHandler);
          }
        }
      };
    }
  }

  /** Compiles data to be used by templates */
  private async compileData() {
    this.allData = {};
    for (let i = 0; i < this.datasetHandlers.length; i++) {
      this.allData = {
        ...this.allData,
        ...this.datasetHandlers[0].content,
      };
    }
  }

  /** Loads helpers */
  private async loadHelpers() {
    this.helpersetHandlers = [];
    if (this.bebar.helpers) {
      for (let i = 0; i < this.bebar.helpers.length; i++) {
        const helper = this.bebar.helpers[i];
        const helperHandler = new HelpersetHandler(helper);
        await helperHandler.load(this.rootPath);
        this.helpersetHandlers.push(helperHandler);
      }
    }
  }

  /** Loads partials */
  private async loadPartials() {
    this.partialsetHandlers = [];
    if (this.bebar.partials) {
      for (let i = 0; i < this.bebar.partials.length; i++) {
        const partial = this.bebar.partials[i];
        const partialHandler = new PartialsetHandler(partial);
        await partialHandler.load(this.rootPath);
        this.partialsetHandlers.push(partialHandler);
      }
    }
  }

  /** Loads templates */
  private async loadTemplates() {
    this.templateHandlers = [];
    if (this.bebar.templates) {
      for (let i = 0; i < this.bebar.templates.length; i++) {
        const template = this.bebar.templates[i];
        const templateHandler = new TemplateHandler(
            template,
            Handlebars.create());
        this.templateHandlers.push(templateHandler);
      }
    }
    if (this.bebar.templates) {
      for (let i = 0; i < this.templateHandlers.length; i++) {
        const templateHandler = this.templateHandlers[i];
        await templateHandler.loadHelpersAndPartials(this.rootPath);

        for (let j = 0; j < this.helpersetHandlers.length; j++) {
          this.helpersetHandlers[j].registerHelpers(templateHandler.handlebars);
        }
        for (let j = 0; j < templateHandler.helpersetHandlers.length; j++) {
          templateHandler.helpersetHandlers[j].registerHelpers(templateHandler.handlebars);
        }

        for (let j = 0; j < this.partialsetHandlers.length; j++) {
          this.partialsetHandlers[j].registerPartials(templateHandler.handlebars);
        }
        for (let j = 0; j < templateHandler.partialsetHandlers.length; j++) {
          templateHandler.partialsetHandlers[j].registerPartials(templateHandler.handlebars);
        }

        templateHandler.bebarData = {
          ...this.allData,
        };
        await templateHandler.load(this.rootPath);
      }
    }
  }

  /**
   * Handles a file change, a file content changed, ...
   * @param {RefreshContext} refreshContext The refresh context
   */
  public async handleRefresh(refreshContext: RefreshContext) {
    if (refreshContext.refreshType === RefreshType.FileContentChanged &&
      await this.handleFileContentChanged(refreshContext)) {
      refreshContext.refreshedObjects.push(this);
      this.compileData();
      return true;
    }

    let refreshOnPartials = false;
    for (let i = 0; i < this.partialsetHandlers.length; i++) {
      const partialsetHandler = this.partialsetHandlers[i];
      if (await partialsetHandler.handleRefresh(refreshContext)) {
        refreshOnPartials = true;
        refreshContext.refreshedObjects.push(this);
      }
    }

    if (refreshOnPartials) {
      for (let i = 0; i < this.partialsetHandlers.length; i++) {
        for (let j = 0; j < this.templateHandlers.length; j++) {
          const partialsetHandler = this.partialsetHandlers[i];
          const templateHandler = this.templateHandlers[j];
          partialsetHandler.unload(templateHandler.handlebars);
          partialsetHandler.registerPartials(templateHandler.handlebars);
        }
      }
    }

    let refreshOnHelpers = false;
    for (let i = 0; i < this.helpersetHandlers.length; i++) {
      const helpersetHandler = this.helpersetHandlers[i];
      if (await helpersetHandler.handleRefresh(refreshContext)) {
        refreshOnHelpers = true;
        if (!refreshOnPartials) {
          refreshContext.refreshedObjects.push(this);
        }
      }
    }

    if (refreshOnHelpers) {
      for (let i = 0; i < this.helpersetHandlers.length; i++) {
        for (let j = 0; j < this.templateHandlers.length; j++) {
          const helpersetHandler = this.helpersetHandlers[i];
          const templateHandler = this.templateHandlers[j];
          helpersetHandler.unload(templateHandler.handlebars);
          helpersetHandler.registerHelpers(templateHandler.handlebars);
        }
      }
    }

    let refreshOnData = false;
    for (let i = 0; i < this.datasetHandlers.length; i++) {
      const datasetHandler = this.datasetHandlers[i];
      if ((<FileDatasetHandler> this.datasetHandlers[0]).handleRefresh !== undefined &&
        await (datasetHandler as FileDatasetHandler).handleRefresh(refreshContext)) {
        refreshOnData = true;
        if (!refreshOnPartials && !refreshOnHelpers) {
          refreshContext.refreshedObjects.push(this);
        }
      }
    }
    if (refreshOnData) {
      this.compileData();
    }

    let refreshOnTemplates = false;
    for (let i = 0; i < this.templateHandlers.length; i++) {
      const templateHandler = this.templateHandlers[i];
      templateHandler.bebarData = {
        ...this.allData,
      };
      if (await templateHandler.handleRefresh(refreshContext, refreshOnPartials || refreshOnHelpers || refreshOnData)) {
        refreshOnTemplates = true;
        if (!refreshOnPartials && !refreshOnHelpers && !refreshOnData) {
          refreshContext.refreshedObjects.push(this);
        }
      }
    }
    return refreshOnPartials || refreshOnHelpers || refreshOnData || refreshOnTemplates;
  }

  /**
   * Handles a change in the content of a file
   * @param {RefreshContext} refreshContext The refresh context
   * @return {boolean} Returns true if the changed occurred in one of the partial files
   */
  private async handleFileContentChanged(refreshContext: RefreshContext): Promise<boolean> {
    if (this.filename === refreshContext.newFilePath) {
      let result = false;
      const plainObject = YAML.parse(refreshContext.newFileContent);
      const newBebar = new Bebar(plainObject);

      if (!deepEqual(this.bebar.helpers, newBebar.helpers)) {
        result = true;
        for (let i = 0; i < this.helpersetHandlers.length; i++) {
          for (let j = 0; j < this.templateHandlers.length; j++) {
            await this.helpersetHandlers[i].unload(this.templateHandlers[j].handlebars);
          }
        }
        this.bebar.helpers = newBebar.helpers;
        await this.loadHelpers();
      }

      if (!deepEqual(this.bebar.partials, newBebar.partials)) {
        result = true;
        for (let i = 0; i < this.partialsetHandlers.length; i++) {
          for (let j = 0; j < this.templateHandlers.length; j++) {
            await this.partialsetHandlers[i].unload(this.templateHandlers[j].handlebars);
          }
        }
        this.bebar.partials = newBebar.partials;
        await this.loadPartials();
      }

      if (!deepEqual(this.bebar.data, newBebar.data)) {
        result = true;
        this.bebar.data = newBebar.data;
        await this.loadDatasets();
      }

      if (!deepEqual(this.bebar.templates, newBebar.templates)) {
        result = true;
        for (let i = 0; i < this.templateHandlers.length; i++) {
          await this.templateHandlers[i].unload();
        }
        this.bebar.templates = newBebar.templates;
        await this.loadTemplates();
      }

      return result;
    }
    return false;
  }


  // private async handleFileContentChangedForPartialArray(
  //   refreshContext: RefreshContext,
  //   existingPartials: PartialsetHandler[],
  //   newPartials: Partialset[]
  //   ): Promise<PartialsetHandler[] | undefined> {

  //   const result: PartialsetHandler[] = [];
  //   let changeDetected = false;

  //   for (let i = 0; i < existingPartials.length; i++) {
  //     let foundMatch = false;
  //     for (let j = 0; j < newPartials.length && !foundMatch; j++) {
  //       foundMatch = deepEqual(existingPartials[i].partialset, newPartials[j]);
  //     }
  //     if (foundMatch) {
  //       result.push(existingPartials[i]);
  //     } else {
  //       existingPartials[i].unload(refreshContext);
  //       changeDetected = true;
  //     }
  //   }

  //   for (let i = 0; i < newPartials.length; i++) {
  //     let foundMatch = false;
  //     for (let j = 0; j < existingPartials.length && !foundMatch; j++) {
  //       foundMatch = deepEqual(existingPartials[j].partialset, newPartials[i]);
  //     }
  //     if (!foundMatch) {
  //       const partialHandler = new PartialsetHandler(newPartials[i]);
  //       await partialHandler.load(refreshContext.rootPath);
  //       result.push(partialHandler);
  //       changeDetected = true;
  //     }
  //   }
  //   return changeDetected ? result : undefined;
  // }
};
