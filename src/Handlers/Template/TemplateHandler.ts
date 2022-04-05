import {DatasetFactory} from '../../Factories/DatasetFactory';
import {Template} from '../../Models/Template';
import {Output} from '../../Models/Output';
import {Iterator} from '../../Models/Iterator';
import {DatasetHandler} from '../Dataset/DatasetHandler';
import {HelpersetHandler} from '../Helper/HelpersetHandler';
import {PartialsetHandler} from '../Partialset/PartialsetHandler';
import path from 'path';
import fs from 'fs';
import {AxiosInstance} from '../../Utils/AxiosInstance';
const axios = AxiosInstance.getInstance().axios;
import prettier from 'prettier';
import {Logger} from '../../Logging/Logger';
import {TemplateLoadingException}
  from './../../Exceptions/TemplateLoadingException';
import {TemplateRegisteringException}
  from './../../Exceptions/TemplateRegisteringException';
import {TemplateExecutionException}
  from './../../Exceptions/TemplateExecutionException';
import {RefreshContext} from './../../Refresh/RefreshContext';
import {RefreshType} from './../../Refresh/RefreshType';
import {FileDatasetHandler} from '../Dataset/FileDatasetHandler';
import {PathUtils} from '../../Utils/PathUtils';

/**
 * A template handler is reponsible for reading and returning data
 * and emitting events when necessary
 */
export class TemplateHandler {
  public compiledTemplate: any;
  private datasetHandlers: DatasetHandler[] = [];
  public partialsetHandlers: PartialsetHandler[] = [];
  public helpersetHandlers: HelpersetHandler[] = [];
  private templateData: any = {};
  public outputs: Output[] = [];
  public bebarData: any = {};

  /**
   * Constructor.
   * @param {Template} Template Object that describes where to get the
   *  partials from
   * @param {any} handlebars Handlebars reference
   */
  constructor(
    public template: Template,
    public handlebars: any) {
  }

  /**
  * Reads data from the source
  * @param {string} rootPath The folder where the bebar file is
  * @return {any} The data extracted from the source
  */
  async load(rootPath: string): Promise<any> {
    await this.handleTemplate(rootPath);
    await this.handleData(rootPath);
    await this.generateOutputs();
  }

  /** Compiles data & templates to produce outputs */
  private async generateOutputs() {
    this.outputs = [];
    this.compileData();
    await this.handleIterators();
    await this.handlePrettifier();
  }

  /**
   * Unloads all partials & helpers from template
   */
  public async unload() {
    for (let i = 0; i < this.partialsetHandlers.length; i++) {
      await this.partialsetHandlers[i].unload(this.handlebars);
    }
    for (let i = 0; i < this.helpersetHandlers.length; i++) {
      await this.helpersetHandlers[i].unload(this.handlebars);
    }
  }

  /**
  * Template management function
  * @param {string} rootPath The folder where the bebar file is
  */
  private async handleTemplate(rootPath: string) {
    const templatename = ` ${this.template.name}`;
    if (this.template.content) {
      await this.registerHandlebarTemplate(this.template.content);
    } else if (this.template.file) {
      try {
        Logger.info(this, `Loading template${templatename} from ${this.template.file}`, '📰');
        const filepath = path.resolve(
            rootPath,
            this.template.file);
        const fileContent =
        fs.readFileSync(filepath, this.template.encoding as BufferEncoding);
        await this.registerHandlebarTemplate(fileContent);
      } catch (e) {
        const ex = new TemplateLoadingException(this, e);
        Logger.error(this, 'Failed loading template file${templatename}', ex);
        throw ex;
      }
    } else if (this.template.url) {
      Logger.info(this, `Loading template${templatename} from ${this.template.url}`, '📰');
      try {
        const response = await axios.request({
          url: this.template.url,
          ...this.template.httpOptions,
        });
        await this.registerHandlebarTemplate(response.data);
      } catch (e) {
        const ex = new TemplateLoadingException(this, e);
        Logger.error(this, 'Failed loading template file${templatename}', ex);
        throw ex;
      }
    }
  }

  /**
   * Loads helpers & partials
   * @param {string} rootPath The folder where the bebar file is
   */
  public async loadHelpersAndPartials(rootPath: string) {
    if (this.template.helpers) {
      for (let i = 0; i < this.template.helpers.length; i++) {
        const helper = this.template.helpers[i];
        const helperHandler = new HelpersetHandler(
            helper,
            this.handlebars);
        await helperHandler.load(rootPath);
        this.helpersetHandlers.push(helperHandler);
      }
    }
    if (this.template.partials) {
      for (let i = 0; i < this.template.partials.length; i++) {
        const partial = this.template.partials[i];
        const partialHandler = new PartialsetHandler(
            partial,
            this.handlebars);
        await partialHandler.load(rootPath);
        this.partialsetHandlers.push(partialHandler);
      }
    }
  }

  /**
   * Registers template to handlebars
   * @param {string} sourceCode The source code containing partial
   *  functions
   */
  private async registerHandlebarTemplate(sourceCode: string) {
    try {
      this.compiledTemplate = await this.handlebars.compile(sourceCode);
    } catch (e) {
      const ex = new TemplateRegisteringException(this, e);
      Logger.error(this, 'Failed registering template', ex);
      throw ex;
    }
  }

  /**
   * Data management function
  * @param {string} rootPath The folder where the bebar file is
   */
  private async handleData(rootPath: string) {
    if (this.template.data) {
      this.templateData = {};
      for (let i = 0; i < this.template.data.length; i++) {
        const data = this.template.data[i];
        const factory = new DatasetFactory(data);
        factory.load(rootPath);
        if (factory.handler) {
          await factory.handler.load(rootPath);
          if (factory.handler) {
            this.datasetHandlers.push(factory.handler as DatasetHandler);
          }
        }
      };
    }
  }

  /** Compiles data to be used by templates */
  private async compileData() {
    this.templateData = {};
    for (let i = 0; i < this.datasetHandlers.length; i++) {
      this.templateData = {
        ...this.templateData,
        ...this.datasetHandlers[i].content,
      };
    }
    this.bebarData = {
      ...this.bebarData,
      ...this.templateData,
    };
  }

  /**
   * Iterators management function
   */
  private async handleIterators() {
    if (this.template.iterators.length > 0) {
      await this.iterate(
          this.template.iterators,
          0,
          this.bebarData,
          {},
          this.bebarData,
          this.template.output,
          this.template.iterationValueName);
    } else {
      await this.produceOutput(this.bebarData, this.template.output);
    }
  }

  /**
   * Pretifier management function
   */
  private async handlePrettifier() {
    return new Promise((resolve) => {
      const exceptions: Array<any> = [];
      if (this.template.prettify) {
        for (let i = 0; i < this.outputs.length; i++) {
          const output = this.outputs[i];
          try {
            output.content = prettier.format(
                output.content,
                this.template.prettify);
          } catch (e) {
            exceptions.push(e);
          }
        }
      }
      resolve(exceptions);
    });
  }

  /**
   * Processes iterators one by one recursively to procude outputs
   * @param {Iterator[]} iterators The list of all iterators
   * @param {number} iteratorIndex The current index in iterations
   * @param {any} data The original data to get information from
   * @param {any} indexedData Where the iteration data will go to
   * @param {any} originalData The original template data
   * @param {string | undefined} output Where the iteration data will go to
   * @param {string | undefined} iterationValueName Indicates the name of the
   *  property where the current iteration will be found within the data. If not
   *  set, iteration values will be pushed at the root of the data passed to the
   *  template
   */
  private async iterate(
      iterators: Iterator[],
      iteratorIndex: number,
      data: any,
      indexedData: any,
      originalData: any,
      output: string | undefined,
      iterationValueName: string | undefined) {
    const currentIterator = iterators[iteratorIndex];
    const currentArray: any[] = currentIterator.array ?
        data[currentIterator.array] :
        data;
    for (let i = 0; i < currentArray.length; i++) {
      indexedData[currentIterator.variable] = currentArray[i];
      const currentData = {
        ...indexedData,
      };
      if (iteratorIndex < iterators.length-1) {
        await this.iterate(
            iterators,
            iteratorIndex+1,
            currentArray[i],
            currentData,
            originalData,
            output,
            iterationValueName);
      } else {
        const outputData = iterationValueName ?
        {
          ...originalData,
          [iterationValueName]: currentData,
        } :
        {
          ...originalData,
          ...currentData,
        };
        await this.produceOutput(outputData, output);
      }
    }
  }

  /**
   * Produces a output an add it to the outputs list
   * @param {any} data The data that should be used to produce the output
   * @param {string} output The name of the file that should be produced
   */
  private async produceOutput(data: any, output: string | undefined) {
    try {
      let processedOutputFilename = output;
      if (output) {
        const outputNameTemplate = await this.handlebars.compile(output);
        processedOutputFilename = await outputNameTemplate(data);
      }
      let outputObject: Output | undefined;
      for (let i = 0; i < this.outputs.length && !outputObject; i++) {
        const curOutput = this.outputs[i];
        if (curOutput.file === processedOutputFilename) {
          outputObject = curOutput;
          outputObject.content = await this.compiledTemplate(data);
        }
      }
      if (!outputObject) {
        this.outputs.push(new Output({
          content: await this.compiledTemplate(data),
          file: processedOutputFilename,
          data: data,
        }));
      }
    } catch (e) {
      const ex = new TemplateExecutionException(this, e);
      Logger.error(this, 'Failed producing output content', ex);
      throw ex;
    }
  }

  /**
   * Handles a file change, a file content changed, ...
   * @param {RefreshContext} refreshContext The refresh context
   * @param {boolean} refreshOutputs Forces the refresh of outputs
   */
  public async handleRefresh(refreshContext: RefreshContext, refreshOutputs: boolean) {
    let refreshOnPartials = false;
    for (let i = 0; i < this.partialsetHandlers.length; i++) {
      const partialsetHandler = this.partialsetHandlers[i];
      const toUnregister = partialsetHandler.partials.map((h) => h.name);
      if (await partialsetHandler.handleRefresh(refreshContext)) {
        for (let j = 0; j < toUnregister.length; j++) {
          this.handlebars.unregisterPartial(toUnregister[j]);
        }
        partialsetHandler.registerPartials(this.handlebars);
        refreshOnPartials = true;
        refreshContext.refreshedObjects.push(this);
      }
    }

    let refreshOnHelpers = false;
    for (let i = 0; i < this.helpersetHandlers.length; i++) {
      const helpersetHandler = this.helpersetHandlers[i];
      const toUnregister = helpersetHandler.helpers.map((h) => h.name);
      if (await helpersetHandler.handleRefresh(refreshContext)) {
        for (let j = 0; j < toUnregister.length; j++) {
          this.handlebars.unregisterHelper(toUnregister[j]);
        }
        helpersetHandler.registerHelpers(this.handlebars);
        refreshOnHelpers = true;
        if (!refreshOnPartials) {
          refreshContext.refreshedObjects.push(this);
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

    let refreshOnTemplate = false;
    if (this.template.file) {
      switch (refreshContext.refreshType) {
        case RefreshType.FileContentChanged:
          if (await this.handleFileContentChanged(refreshContext)) {
            if (!refreshOnPartials && !refreshOnHelpers) {
              refreshContext.refreshedObjects.push(this);
            }
            refreshOnTemplate = true;
          }
          break;
      }
    }

    if (refreshOnTemplate || refreshOnHelpers || refreshOnData || refreshOnTemplate || refreshOutputs) {
      await this.generateOutputs();
      refreshContext.refreshedObjects.push(this);
      return true;
    }
    return false;
  }

  /**
   * Handles a change in the content of a file
   * @param {RefreshContext} refreshContext The refresh context
   * @return {boolean} Returns true if the changed occurred in one of the partial files
   */
  private async handleFileContentChanged(refreshContext: RefreshContext): Promise<boolean> {
    if (PathUtils.pathsAreEqual(path.resolve(refreshContext.rootPath, this.template.file!), refreshContext.newFilePath!)) {
      this.compiledTemplate = await this.handlebars.compile(refreshContext.newFileContent);
      return true;
    }
    return false;
  }
};
