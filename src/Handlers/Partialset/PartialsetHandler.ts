import {Partialset} from '../../Models/Partialset';
import {Settings} from '../../Utils/Settings';
const glob = require('glob');
import path from 'path';
import fs from 'fs';
import util from 'util';
const readFile = util.promisify(fs.readFile);
import Handlebars from 'handlebars';
import {AxiosInstance} from '../../Utils/AxiosInstance';
const axios = AxiosInstance.getInstance().axios;
import {PartialLoadingException}
  from './../../Exceptions/PartialLoadingException';
import {PartialParsingException}
  from './../../Exceptions/PartialParsingException';
import {Logger} from '../../Logging/Logger';

/**
 * A partialset handler is reponsible for reading and returning data
 * and emitting events when necessary
 */
export class PartialsetHandler {
  public registeredPartials: string[] = [];

  /**
   * Constructor.
   * @param {Partialset} Partialset Object that describes where to get the
   *  partials from
   */
  constructor(
    public partialset: Partialset,
    public content: any = undefined) {
  }

  /**
  * Reads data from the source
  * @param {ParserFunction} parser Method to parse file content
  * @return {any} The data extracted from the source
  */
  async load(): Promise<any> {
    let name = this.partialset.name === null ||
      this.partialset.name === undefined ?
      '' :
    this.partialset.name;
    if (name !== '' && this.partialset.content) {
      await this.registerHandlebarPartial(
          name,
          this.partialset.content);
    } else if (this.partialset.file) {
      const partialFiles = glob.sync(path.resolve(
          Settings.workingDirectory, this.partialset.file));
      for (let i = 0; i< partialFiles.length; i++) {
        const pFile = partialFiles[i];
        Logger.info(this, `Loading partial from ${pFile}`, '🧩');
        try {
          if (partialFiles.length > 1) {
            name = path.parse(pFile).name;
          }
          const fileContent =
            await readFile(pFile, this.partialset.encoding as BufferEncoding);
          await this.registerHandlebarPartial(name, fileContent);
        } catch (e) {
          const ex = new PartialLoadingException(this, e);
          Logger.error(this, 'Failed loading partial file', ex);
          throw ex;
        }
      }
    } else if (this.partialset.url) {
      try {
        Logger.info(this, `Loading partial from ${this.partialset.url}`, '🧩');
        const response = await axios.request({
          url: this.partialset.url,
          ...this.partialset.httpOptions,
        });
        await this.registerHandlebarPartial(name, response.data);
      } catch (e) {
        const ex = new PartialLoadingException(this, e);
        Logger.error(this, 'Failed loading partial file', ex);
        throw ex;
      }
    }
  }

  /**
   * Registers partial to handlebars
   * @param {string} name The name of the partial to register
   * @param {string} sourceCode The source code containing partial
   *  functions
   */
  private async registerHandlebarPartial(name: string, sourceCode: string) {
    try {
      await Handlebars.registerPartial(name, sourceCode);
      this.registeredPartials.push(name);
    } catch (e) {
      const ex = new PartialParsingException(this, e);
      Logger.error(this, 'Failed parsing partial file', ex);
      throw ex;
    }
  }
};
