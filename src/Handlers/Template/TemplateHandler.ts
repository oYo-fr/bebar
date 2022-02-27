import {DatasetFactory} from '../../Factories/DatasetFactory';
import {Template} from '../../Models/Template';
import {Output} from '../../Models/Output';
import {Iterator} from '../../Models/Iterator';
import {DatasetHandler} from '../Dataset/DatasetHandler';
import {Settings} from '../../Utils/Settings';
import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
import {AxiosInstance} from '../../Utils/AxiosInstance';
const axios = AxiosInstance.getInstance().axios;
import prettier from 'prettier';

/**
 * A template handler is reponsible for reading and returning data
 * and emitting events when necessary
 */
export class TemplateHandler {
  public compiledTemplate: any;
  private datasetHandlers: DatasetHandler[] = [];
  private templateData: any = {};
  public outputs: Output[] = [];

  /**
   * Constructor.
   * @param {Template} Template Object that describes where to get the
   *  partials from
   */
  constructor(
    public template: Template,
    public bebarData: any = {}) {
  }

  /**
  * Reads data from the source
  * @param {ParserFunction} parser Method to parse file content
  * @return {any} The data extracted from the source
  */
  async load(): Promise<any> {
    await this.handleTemplate();
    await this.handleData();
    await this.handleIterators();
    await this.handlePretifier();
  }

  /**
   * Template management function
   */
  private async handleTemplate() {
    if (this.template.content) {
      await this.registerHandlebarTemplate(this.template.content);
    } else if (this.template.file) {
      const filepath = path.resolve(
          Settings.getInstance().workingDirectory,
          this.template.file);
      const fileContent =
        fs.readFileSync(filepath, this.template.encoding as BufferEncoding);
      await this.registerHandlebarTemplate(fileContent);
    } else if (this.template.url) {
      const response = await axios.request({
        url: this.template.url,
        ...this.template.httpOptions,
      });
      await this.registerHandlebarTemplate(response.data);
    }
  }

  /**
   * Registers template to handlebars
   * @param {string} sourceCode The source code containing partial
   *  functions
   */
  private async registerHandlebarTemplate(sourceCode: string) {
    this.compiledTemplate = await Handlebars.compile(sourceCode);
  }

  /**
   * Data management function
   */
  private async handleData() {
    if (this.template.data) {
      this.templateData = {};
      for (let i = 0; i < this.template.data.length; i++) {
        const data = this.template.data[i];
        const factory = new DatasetFactory(data);
        factory.load();
        if (factory.handler) {
          await factory.handler.load();
          this.datasetHandlers.push(factory.handler as DatasetHandler);
          this.templateData = {
            ...this.templateData,
            ...factory.handler?.content,
          };
        }
      };
      this.bebarData = {
        ...this.bebarData,
        ...this.templateData,
      };
    }
  }

  /**
   * Iterators management function
   */
  private async handleIterators() {
    if (this.template.iterators) {
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
  private async handlePretifier() {
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
    let processedOutputFilename = output;
    if (output) {
      const outputNameTemplate = await Handlebars.compile(output);
      processedOutputFilename = await outputNameTemplate(data);
    }
    this.outputs.push(new Output({
      content: await this.compiledTemplate(data),
      file: processedOutputFilename,
    }));
  }
};
