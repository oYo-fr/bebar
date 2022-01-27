import {Helperset} from '../../Models/Helperset';
import {Settings} from '../../Utils/Settings';
import glob from 'glob';
import path from 'path';
import fs from 'fs';
import util from 'util';
const readFile = util.promisify(fs.readFile);
import Handlebars from 'handlebars';
import {AxiosInstance} from '../../Utils/AxiosInstance';
const axios = AxiosInstance.getInstance().axios;

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
   */
  constructor(
    public helperset: Helperset,
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
              Settings.getInstance().workingDirectory, this.helperset.file));
      helperFiles.forEach(async (hFile: any) => {
        const fileContent =
          await readFile(hFile, this.helperset.encoding as BufferEncoding);
        this.registerHandlebarHelpers(fileContent);
      });
    } else if (this.helperset.url) {
      const response = await axios.request({
        url: this.helperset.url,
        ...this.helperset.httpOptions,
      });
      this.registerHandlebarHelpers(response.data);
    }
  }

  /**
   * Registers helper functions from javascript code
   * @param {string} sourceCode The source code containing helper
   *  functions
   */
  private async registerHandlebarHelpers(sourceCode: string) {
    const hResult = await eval(sourceCode);
    for (let i = 0; i < Object.keys(hResult).length; i++) {
      const key = Object.keys(hResult)[i];
      await Handlebars.registerHelper(key, hResult[key]);
      this.registeredHelpers.push(key);
    }
  }
};
