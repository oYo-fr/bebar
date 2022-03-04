import {Helperset} from '../../Models/Helperset';
import {Settings} from '../../Utils/Settings';
import {Logger} from '../../Logging/Logger';
import {HelperLoadingException}
  from './../../Exceptions/HelperLoadingException';
import {HelperParsingException}
  from './../../Exceptions/HelperParsingException';
import {HelperRegisteringException}
  from './../../Exceptions/HelperRegisteringException';
const glob = require('glob');
import path from 'path';
import fs from 'fs';
import util from 'util';
const readFile = util.promisify(fs.readFile);
import {AxiosInstance} from '../../Utils/AxiosInstance';
const axios = AxiosInstance.getInstance().axios;
const nodeEval = require('node-eval');

/**
 * A helperset handler is reponsible for reading and returning data
 * and emitting events when necessary
 */
export class HelpersetHandler {
  public registeredHelpers: string[] = [];

  /**
   * Constructor.
   * @param {Helperset} Helperset Object that describes where to get the
   *  helpers from
   * @param {any} handlebars Handlebars reference
   */
  constructor(
    public helperset: Helperset,
    public handlebars: any,
    public content: any = undefined) {
  }

  /**
  * Reads data from the source
  * @param {ParserFunction} parser Method to parse file content
  * @return {any} The data extracted from the source
  */
  async load(): Promise<any> {
    if (this.helperset.file) {
      const helperFiles = glob.sync(
          path.resolve(
              Settings.workingDirectory, this.helperset.file));
      for (let i = 0; i < helperFiles.length; i++) {
        const hFile = helperFiles[i];
        Logger.info(this, `Loading helpers from ${hFile}`, '⚙️');
        try {

        } catch (e) {
          const ex = new HelperLoadingException(this, e);
          Logger.error(this, 'Failed loading helper file', ex);
          throw ex;
        }
        const fileContent =
          await readFile(hFile, this.helperset.encoding as BufferEncoding);
        await this.registerHandlebarHelpers(fileContent);
      };
    } else if (this.helperset.url) {
      Logger.info(this, `Loading helpers from ${this.helperset.url}`, '⚙️');
      const response = await axios.request({
        url: this.helperset.url,
        ...this.helperset.httpOptions,
      });
      await this.registerHandlebarHelpers(response.data);
    }
  }

  /**
   * Registers helper functions from javascript code
   * @param {string} sourceCode The source code containing helper
   *  functions
   */
  private async registerHandlebarHelpers(sourceCode: string) {
    try {
      const hResult = await nodeEval(sourceCode, Settings.workingDirectory);
      for (let i = 0; i < Object.keys(hResult).length; i++) {
        const key = Object.keys(hResult)[i];
        try {
          Logger.info(this, `\t- ${key}`);
          await this.handlebars.registerHelper(key, hResult[key]);
          this.registeredHelpers.push(key);
        } catch (e) {
          const ex = new HelperRegisteringException(this, e);
          Logger.error(this, 'Failed registering helper', ex);
          throw ex;
        }
      }
    } catch (e) {
      const ex = new HelperParsingException(this, e);
      Logger.error(this, 'Failed parsing javascript content', ex);
      throw ex;
    }
  }
};
