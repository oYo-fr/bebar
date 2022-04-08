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
import {Logger} from '../../Logging/Logger';
import {Partial} from './Partial';
import {RefreshContext} from './../../Refresh/RefreshContext';
import {RefreshType} from './../../Refresh/RefreshType';
import {PathUtils} from './../../Utils/PathUtils';

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
   * Unloads all partials
   * @param {any} handlebars The handlebars context
   */
  public async unload(handlebars: any) {
    for (let i = 0; i < this.partials.length; i++) {
      const partial = this.partials[i];
      await handlebars.unregisterPartial(partial.name);
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
    this.partials.push(new Partial(name, sourceCode, origin));
  }

  /**
   * Registers partial functions to handlebars
   * @param {any} handlebars The handlebars instance to register the partial to
   */
  public async registerPartials(handlebars: any) {
    for (let i = 0; i < this.partials.length; i++) {
      const partial = this.partials[i];
      await handlebars.registerPartial(partial.name, partial.code);
    }
  }

  /**
   * Handles a file change, a file content changed, ...
   * @param {RefreshContext} refreshContext The refresh context
   * @return {boolean} Returns true if the changed occurred in one of the partial files
   */
  public async handleRefresh(refreshContext: RefreshContext): Promise<boolean> {
    if (!this.partialset.file) return false;
    let result = false;
    switch (refreshContext.refreshType) {
      case RefreshType.FileContentChanged:
        if (await this.handleFileContentChanged(refreshContext)) {
          refreshContext.refreshedObjects.push(this);
          result = true;
        }
        break;
      case RefreshType.FileCreated:
        if (await this.handleFileCreated(refreshContext)) {
          refreshContext.refreshedObjects.push(this);
          result = true;
        }
        break;
      case RefreshType.FileDeleted:
        if (await this.handleFileDeleted(refreshContext)) {
          refreshContext.refreshedObjects.push(this);
          result = true;
        }
        break;
      case RefreshType.FileMovedOrRenamed:
        if (await this.handleFileMovedOrRenamed(refreshContext)) {
          refreshContext.refreshedObjects.push(this);
          result = true;
        }
        break;
    }
    return result;
  }

  /**
   * Handles a change in the content of a file
   * @param {RefreshContext} refreshContext The refresh context
   * @return {boolean} Returns true if the changed occurred in one of the partial files
   */
  private async handleFileContentChanged(refreshContext: RefreshContext): Promise<boolean> {
    for (let i = 0; i < this.partials.length; i++) {
      const partial = this.partials[i];
      if (PathUtils.pathsAreEqual(partial.origin, refreshContext.newFilePath!)) {
        partial.code = refreshContext.newFileContent;
        return true;
      }
    }
    return false;
  }

  /**
   * Handles a new file creation
   * @param {RefreshContext} refreshContext The refresh context
   * @return {boolean} Returns true if the changed occurred in one of the partial files
   */
  private async handleFileCreated(refreshContext: RefreshContext): Promise<boolean> {
    let result = false;
    let name = this.partialset.name === null ||
    this.partialset.name === undefined ?
    '' :
    this.partialset.name;
    const globResults = glob.sync(path.resolve(refreshContext.rootPath, this.partialset.file!));
    for (let i = 0; i< globResults.length; i++) {
      const globResult = globResults[i];

      if (globResult === refreshContext.newFilePath) {
        result = true;
        if (globResults.length > 1 || name === '') {
          name = path.parse(globResult).name;
        }
        try {
          const fileContent = await readFile(globResult, this.partialset.encoding as BufferEncoding);
          await this.saveHandlebarPartial(name, fileContent, globResult);
        } catch (e) {
          const ex = new PartialLoadingException(this, e);
          Logger.error(this, 'Failed loading partial file', ex);
          throw ex;
        }
      }
    }
    return result;
  }

  /**
   * Handles the deletion of a file
   * @param {RefreshContext} refreshContext The refresh context
   * @return {boolean} Returns true if the changed occurred in one of the partial files
   */
  private async handleFileDeleted(refreshContext: RefreshContext): Promise<boolean> {
    for (let i = 0; i < this.partials.length; i++) {
      const partial = this.partials[i];
      if (PathUtils.pathsAreEqual(partial.origin, refreshContext.oldFilePath!)) {
        this.partials.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  /**
   * Handles a the move or rename of a file
   * @param {RefreshContext} refreshContext The refresh context
   * @return {boolean} Returns true if the changed occurred in one of the
   *  partial files
   */
  private async handleFileMovedOrRenamed(refreshContext: RefreshContext): Promise<Boolean> {
    const globResults = glob.sync(path.resolve(refreshContext.rootPath, this.partialset.file!));
    const foundInGlob = globResults.some((g: string) => PathUtils.pathsAreEqual(g, refreshContext.newFilePath!));
    let result = false;
    let foundInActual = false;
    let spliceIndex = -1;
    for (let i = 0; i < this.partials.length; i++) {
      const partial = this.partials[i];
      if (PathUtils.pathsAreEqual(partial.origin, refreshContext.oldFilePath!)) {
        foundInActual = true;
        if (!foundInGlob) {
          spliceIndex = i;
        } else {
          partial.origin = refreshContext.newFilePath!;
          foundInActual = true;
        }
      }
    }

    if (spliceIndex >= 0) {
      this.partials.splice(spliceIndex, 1);
    }

    if (!foundInActual && foundInGlob) {
      await this.handleFileCreated(refreshContext);
      result = true;
    }

    if (foundInActual && !foundInGlob) {
      result = true;
    }

    // if (foundInActual && foundInGlob) {
    if (globResults.length > 1 || !this.partialset.name) {
      for (let i = 0; i < this.partials.length; i ++) {
        const partial = this.partials[i];
        partial.name = path.parse(partial.origin).name;
      }
    } else {
      this.partials[0].name = this.partialset.name;
    }
    // }

    return result;
  }
};
