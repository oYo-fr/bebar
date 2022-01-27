import {DatasetException} from '../../Exceptions/DatasetException';
import {Dataset} from '../../Models/Dataset';
import {DatasetHandler} from './DatasetHandler';
import {Settings} from './../../Utils/Settings';
import {AxiosInstance} from '../../Utils/AxiosInstance';
const axios = AxiosInstance.getInstance().axios;
import fs from 'fs';
import path from 'path';
import util from 'util';
const readFile = util.promisify(fs.readFile);

type ParserFunction = (data: string, options?: any, context?: any)
  => Promise<any>;

/**
 * Generic Dataset handler class
 * A dataset handler is reponsible for reading and returning data
 * and emitting events when necessary
 */
export abstract class FileDatasetHandler extends DatasetHandler {
  /**
   * Reads data from the source
   * @param {ParserFunction} parser Method to parse file content
   * @return {any} The data extracted from the source
   */
  async loadWithParser(parser: ParserFunction): Promise<any> {
    try {
      const content = this.dataset.url ?
        (await axios
            .request({
              url: this.dataset.url,
              ...this.dataset.httpOptions,
            })).data :
        await this.readFromFile();
      const datasetName = this.dataset.name as string;

      const options = this.dataset.options;
      const context = {
        data: this.dataset,
        workingDir: Settings.getInstance().workingDirectory,
      };
      this.content = {
        [datasetName]: typeof(content) === 'string' ?
        await parser(content, options, context) :
        content,
      };
    } catch (e) {
      throw new DatasetException(this, e);
    }
    return this.content;
  }

  /**
   * Reads the file content
   * @return {any} The content of the file
   */
  private async readFromFile(): Promise<any> {
    const filepath = path.resolve(
        Settings.getInstance().workingDirectory,
        this.dataset.file!);
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
};
