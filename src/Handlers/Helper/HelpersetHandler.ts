import {Helperset} from '../../Models/Helperset';
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
import {Helper} from './Helper';

/**
 * A helperset handler is reponsible for reading and returning data
 * and emitting events when necessary
 */
export class HelpersetHandler {
  public helpers: Helper[] = [];

  /**
   * Constructor.
   * @param {Helperset} Helperset Object that describes where to get the
   *  helpers from
   */
  constructor(
    public helperset: Helperset,
    public content: any = undefined) {
  }

  /**
  * Reads data from the source
  * @param {string} rootPath The folder where the bebar file is
  * @return {any} The data extracted from the source
  */
  async load(rootPath: string): Promise<any> {
    if (this.helperset.file) {
      const helperFiles = glob.sync(
          path.resolve(rootPath, this.helperset.file));
      for (let i = 0; i < helperFiles.length; i++) {
        const hFile = helperFiles[i];
        Logger.info(this, ` Loading helpers from ${hFile}`, '⚙️');
        try {

        } catch (e) {
          const ex = new HelperLoadingException(this, e);
          Logger.error(this, 'Failed loading helper file', ex);
          throw ex;
        }
        const fileContent =
          await readFile(hFile, this.helperset.encoding as BufferEncoding);
        await this.saveHandlebarHelpers(fileContent, rootPath);
      };
    } else if (this.helperset.url) {
      Logger.info(this, ` Loading helpers from ${this.helperset.url}`, '⚙️');
      const response = await axios.request({
        url: this.helperset.url,
        ...this.helperset.httpOptions,
      });
      await this.saveHandlebarHelpers(response.data, rootPath);
    }
  }

  /**
   * Registers helper functions from javascript code
   * @param {string} sourceCode The source code containing helper
   * @param {string} rootPath The folder where the bebar file is
   *  functions
   */
  private async saveHandlebarHelpers(sourceCode: string, rootPath: string) {
    try {
      const hResult = await nodeEval(sourceCode, rootPath);
      for (let i = 0; i < Object.keys(hResult).length; i++) {
        const key = Object.keys(hResult)[i];
        Logger.info(this, `\t- ${key}`);
        this.helpers.push(new Helper(key, hResult[key]));
      }
    } catch (e) {
      const ex = new HelperParsingException(this, e);
      Logger.error(this, 'Failed parsing javascript content', ex);
      throw ex;
    }
  }

  /**
   * Registers helper functions to handlebars
   * @param {any} handlebars The handlebars instance to register the function to
   */
  public async registerHelpers(handlebars: any) {
    for (let i = 0; i < this.helpers.length; i++) {
      const helper = this.helpers[i];
      try {
        await handlebars.registerHelper(helper.name, helper.func);
      } catch (e) {
        const ex = new HelperRegisteringException(this, e);
        Logger.error(this, 'Failed registering helper', ex);
        throw ex;
      }
    }
  }
};
