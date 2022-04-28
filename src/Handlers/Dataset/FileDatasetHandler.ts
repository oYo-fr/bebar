import {DatasetLoadingException}
  from '../../Exceptions/DatasetLoadingException';
import {Dataset} from '../../Models/Dataset';
import {DatasetHandler} from './DatasetHandler';
import {AxiosInstance} from '../../Utils/AxiosInstance';
import {Logger} from '../../Logging/Logger';
const axios = AxiosInstance.getInstance().axios;
import fs from 'fs';
import path from 'path';
import util from 'util';
const readFile = util.promisify(fs.readFile);
import {RefreshContext} from './../../Refresh/RefreshContext';
import {RefreshType} from './../../Refresh/RefreshType';
import {PathUtils} from '../../Utils/PathUtils';
import {DiagnosticBag} from './../../Diagnostics/DiagnosticBag';
import {DiagnosticSeverity} from './../../Diagnostics/DiagnosticSeverity';
import {DatasetCache} from './../../Caching/DatasetCache';
import {BebarHandlerContext} from '../Bebar/BebarHandlerContext';
const glob = require('glob');

type ParserFunction = (
  data: string, options?: any, context?: any, rootPath?: string)
  => Promise<any>;

/**
 * Generic Dataset handler class
 * A dataset handler is reponsible for reading and returning data
 * and emitting events when necessary
 */
export abstract class FileDatasetHandler extends DatasetHandler {
  public parser: ParserFunction | undefined = undefined;

  /**
   * Reads data from the source
   * @param {BebarHandlerContext} ctx The bebar execution context
   * @param {string} fileContent The content of the file (undefined to read from disc or url)
   * @return {any} The data extracted from the source
   */
  async loadData(ctx: BebarHandlerContext, fileContent: string | undefined): Promise<any> {
    try {
      if (this.dataset.file) {
        if (glob.hasMagic(path.resolve(ctx.rootPath, this.dataset.file!))) {
          const globResult = glob.sync(path.resolve(ctx.rootPath, this.dataset.file!));
          if (globResult && globResult.length > 0) {
            this.dataset.file = globResult[0];
            this.dataset.setDefaults();
          }
        }
      }

      this.content = await DatasetCache.get(this.dataset, this.fetchAndParseData, {ctx: ctx, fileContent: fileContent, instance: this});
    } catch (e) {
      const error = (e as any).message ?? (e as any).toString();
      DiagnosticBag.add(
          0, 0, 0, 0,
          'Failed loading data: ' + error,
          DiagnosticSeverity.Error,
          this.dataset.file ? path.resolve(ctx.rootPath, this.dataset.file) : this.dataset.url!);
      const ex = new DatasetLoadingException(this, e);
      Logger.error(this, 'Failed loading data', ex);
      throw ex;
    }
    return this.content;
  }

  /**
   * Reads data from the source and parse it using the givent parser and options
   * @param {any} options The options to pass to the data parser
   * @return {any} The data from the source, as an object
   */
  private async fetchAndParseData(options: any): Promise<any> {
    const content = options.fileContent ?? (options.instance.dataset.file ?
      await FileDatasetHandler.readFromFile(options.instance, options.ctx) :
      await FileDatasetHandler.readFromUrl(options.instance));
    options.instance.key = options.instance.dataset.name as string;

    const datasetOptions = options.instance.dataset.options;
    const context = {
      data: options.instance.dataset,
      workingDir: options.rootPath,
    };
    return {
      [options.instance.key]: typeof(content) === 'string' ?
        await options.instance.parser!(content, datasetOptions, context, options.rootPath) :
        content,
    };
  }

  /**
   * Reads the file content
   * @param {FileDatasetHandler} instance The instance of the handler that contains information
   * on how to load data
   * @return {any} The content of the file
   */
  private static async readFromUrl(instance: FileDatasetHandler): Promise<any> {
    Logger.info(this, `Loading data from ${instance.dataset.url}`, '📈');
    return (await axios
        .request({
          url: instance.dataset.url,
          ...instance.dataset.httpOptions,
        })).data;
  }

  /**
  * Reads the file content
  * @param {FileDatasetHandler} instance The instance of the handler that contains information
  * on how to load data
  * @param {BebarHandlerContext} ctx The bebar execution context
  * @return {any} The content of the file
  */
  private static async readFromFile(instance: FileDatasetHandler, ctx: BebarHandlerContext): Promise<any> {
    const filepath = path.resolve(
        ctx.rootPath,
        instance.dataset.file!);
    Logger.info(this, `Loading data from ${filepath}`, '📈');
    const encoding: string = instance.dataset.encoding!;
    const result = await readFile(filepath, encoding as BufferEncoding);
    return result;
  }

  /**
   * Returns true if the dataset parseAs property of the file extension is
   * equal to a certain value
   * @param {Dataset} dataset The dataset to check the value from
   * @param {string} expectedValue The expected file type
   * @return {boolean} True if the property parseAs of the file extension of a
   * file is equal to a certain value
   */
  protected static checkParseAsOrFileExtension(
      dataset: Dataset,
      expectedValue: string,
  ): boolean {
    return dataset !== null && dataset !== undefined &&
    (DatasetHandler.checkParseAs(dataset, expectedValue) ||
    FileDatasetHandler.checkFileExtension(dataset, expectedValue));
  }

  /**
   * Returns true if the dataset parseAs property of the file extension is
   * equal to a certain value
   * @param {Dataset} dataset The dataset to check the value from
   * @param {string} expectedValue The expected file type
   * @return {boolean} True if the property parseAs of the file extension of a
   * file is equal to a certain value
   */
  private static checkFileExtension(
      dataset: Dataset,
      expectedValue: string,
  ): boolean {
    return dataset !== null && dataset !== undefined && (
      dataset.file != null &&
      dataset.file != undefined &&
      dataset.file.toLowerCase().endsWith(`.${expectedValue}`));
  }

  /**
   * Handles a file change, a file content changed, ...
   * @param {RefreshContext} refreshContext The refresh context
   * @return {boolean} Returns true if the changed occurred in one of the partial files
   */
  public async handleRefresh(refreshContext: RefreshContext): Promise<boolean> {
    if (!this.dataset.file || refreshContext.refreshType === RefreshType.FileCreated) {
      return false;
    }
    if (refreshContext.newFilePath &&
        !PathUtils.pathsAreEqual(path.resolve(refreshContext.ctx.rootPath, this.dataset.file), refreshContext.newFilePath!)) {
      return false;
    }
    try {
      await this.loadData(refreshContext.ctx, refreshContext.newFileContent);
    } catch {}
    refreshContext.refreshedObjects.push(this);
    return true;
  }
};
