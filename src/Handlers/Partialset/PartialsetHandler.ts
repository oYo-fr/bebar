import {Partialset} from '../../Models/Partialset';
const glob = require('glob');
import path from 'path';
import fs from 'fs';
import util from 'util';
const readFile = util.promisify(fs.readFile);
import {AxiosInstance} from '../../Utils/AxiosInstance';
const axios = AxiosInstance.getInstance().axios;
import {PartialLoadingException}
  from './../../Exceptions/PartialLoadingException';
import {PartialRegisteringException}
  from '../../Exceptions/PartialRegisteringException';
import {Logger} from '../../Logging/Logger';
import {Partial} from './Partial';

/**
 * A partialset handler is reponsible for reading and returning data
 * and emitting events when necessary
 */
export class PartialsetHandler {
  public partials: Partial[] = [];

  /**
   * Constructor.
   * @param {Partialset} Partialset Object that describes where to get the
   *  partials from
   * @param {any} content The content of the partial
   */
  constructor(
    public partialset: Partialset,
    public content: any = undefined) {
  }

  /**
  * Reads data from the source
  * @param {string} rootPath The folder where the bebar file is
  * @return {any} The data extracted from the source
  */
  async load(rootPath: string): Promise<any> {
    let name = this.partialset.name === null ||
      this.partialset.name === undefined ?
      '' :
      this.partialset.name;
    if (name !== '' && this.partialset.content) {
      await this.saveHandlebarPartial(
          name,
          this.partialset.content,
          '');
    } else if (this.partialset.file) {
      const partialFiles = glob.sync(path.resolve(
          rootPath, this.partialset.file));
      for (let i = 0; i< partialFiles.length; i++) {
        const pFile = partialFiles[i];
        if (partialFiles.length > 1 || name === '') {
          name = path.parse(pFile).name;
        }
        Logger.info(this, `Loading partial ${name} from ${pFile}`, '🧩');
        try {
          const fileContent =
            await readFile(pFile, this.partialset.encoding as BufferEncoding);
          await this.saveHandlebarPartial(name, fileContent, pFile);
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
        await this.saveHandlebarPartial(
            name,
            response.data,
            this.partialset.url);
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
   * @param {string} origin The origin of the partial (file or url)
   *  functions
   */
  private async saveHandlebarPartial(
      name: string,
      sourceCode: string,
      origin: string) {
    try {
      this.partials.push(new Partial(name, sourceCode, origin));
    } catch (e) {
      const ex = new PartialRegisteringException(this, e);
      Logger.error(this, 'Failed parsing partial file', ex);
      throw ex;
    }
  }

  /**
   * Registers partial functions to handlebars
   * @param {any} handlebars The handlebars instance to register the partial to
   */
  public async registerPartials(handlebars: any) {
    for (let i = 0; i < this.partials.length; i++) {
      const partial = this.partials[i];
      try {
        await handlebars.registerPartial(partial.name, partial.code);
      } catch (e) {
        const ex = new PartialRegisteringException(this, e);
        Logger.error(this, 'Failed registering partial', ex);
        throw ex;
      }
    }
  }
};
