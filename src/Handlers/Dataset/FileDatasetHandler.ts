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
   * @param {string} rootPath The folder where the bebar file is
   * @param {string} fileContent The content of the file (undefined to read from disc or url)
   * @return {any} The data extracted from the source
   */
  async loadData(rootPath: string, fileContent: string | undefined): Promise<any> {
    try {
      const content = fileContent ?? (this.dataset.file ?
        await this.readFromFile(rootPath) :
        await this.readFromUrl());
      const datasetName = this.dataset.name as string;

      const options = this.dataset.options;
      const context = {
        data: this.dataset,
        workingDir: rootPath,
      };
      this.content = {
        [datasetName]: typeof(content) === 'string' ?
          await this.parser!(content, options, context, rootPath) :
          content,
      };
    } catch (e) {
      const error = (e as any).message ?? (e as any).toString();
      DiagnosticBag.add(
          0, 0, 0, 0,
          'Failed loading data: ' + error,
          DiagnosticSeverity.Error,
          this.dataset.file ? path.resolve(rootPath, this.dataset.file) : this.dataset.url!);
      const ex = new DatasetLoadingException(this, e);
      Logger.error(this, 'Failed loading data', ex);
      throw ex;
    }
    return this.content;
  }

  /**
   * Reads the file content
   * @return {any} The content of the file
   */
  private async readFromUrl(): Promise<any> {
    Logger.info(this, `Loading data from ${this.dataset.url}`, '📈');
    return (await axios
        .request({
          url: this.dataset.url,
          ...this.dataset.httpOptions,
        })).data;
  }

  /**
  * Reads the file content
  * @param {string} rootPath The folder where the bebar file is
  * @return {any} The content of the file
  */
  private async readFromFile(rootPath: string): Promise<any> {
    const filepath = path.resolve(
        rootPath,
        this.dataset.file!);
    Logger.info(this, `Loading data from ${filepath}`, '📈');
    const encoding: string = this.dataset.encoding!;
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
        !PathUtils.pathsAreEqual(path.resolve(refreshContext.rootPath, this.dataset.file), refreshContext.newFilePath!)) {
      return false;
    }
    await this.loadData(refreshContext.rootPath, refreshContext.newFileContent);
    refreshContext.refreshedObjects.push(this);
    return true;
  }
};
