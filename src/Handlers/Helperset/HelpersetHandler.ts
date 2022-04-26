import {Helperset} from '../../Models/Helperset';
import {Logger} from '../../Logging/Logger';
import {HelperLoadingException}
  from '../../Exceptions/HelperLoadingException';
import {HelperParsingException}
  from '../../Exceptions/HelperParsingException';
import {HelperRegisteringException}
  from '../../Exceptions/HelperRegisteringException';
const glob = require('glob');
import path from 'path';
import fs from 'fs';
import util from 'util';
const readFile = util.promisify(fs.readFile);
import {AxiosInstance} from '../../Utils/AxiosInstance';
const axios = AxiosInstance.getInstance().axios;
const nodeEval = require('node-eval');
import {Helper} from './Helper';
import {RefreshContext} from '../../Refresh/RefreshContext';
import {RefreshType} from '../../Refresh/RefreshType';
import {PathUtils} from '../../Utils/PathUtils';
import {DiagnosticBag} from '../../Diagnostics/DiagnosticBag';
import {DiagnosticSeverity} from '../../Diagnostics/DiagnosticSeverity';
import {BebarHandlerContext} from '../Bebar/BebarHandlerContext';

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
  * @param {BebarHandlerContext} ctx The bebar execution context
  * @return {any} The data extracted from the source
  */
  async load(ctx: BebarHandlerContext): Promise<any> {
    if (this.helperset.file) {
      const helperFiles = glob.sync(path.resolve(ctx.rootPath, this.helperset.file));
      for (let i = 0; i < helperFiles.length; i++) {
        const hFile = helperFiles[i];
        Logger.info(this, ` Loading helpers from ${hFile}`, '⚙️');
        try {
          const fileContent =
            await readFile(hFile, this.helperset.encoding as BufferEncoding);
          await this.saveHandlebarHelpers(fileContent, ctx, hFile);
        } catch (e) {
          const ex = new HelperLoadingException(this, e);
          Logger.error(this, 'Failed loading helper file', ex);
          throw ex;
        }
      };
    } else if (this.helperset.url) {
      Logger.info(this, ` Loading helpers from ${this.helperset.url}`, '⚙️');
      const response = await axios.request({
        url: this.helperset.url,
        ...this.helperset.httpOptions,
      });
      await this.saveHandlebarHelpers(
          response.data,
          ctx,
          this.helperset.url);
    }
  }

  /**
   * Unloads all helpers
   * @param {any} handlebars The handlebars context
   */
  public async unload(handlebars: any) {
    for (let i = 0; i < this.helpers.length; i++) {
      const helper = this.helpers[i];
      await handlebars.unregisterHelper(helper.name);
    }
  }

  /**
   * Registers helper functions from javascript code
   * @param {string} sourceCode The source code containing helper
   * @param {BebarHandlerContext} ctx The bebar execution context
   * @param {string} origin The origin of the helper (file or url)
   *  functions
   */
  private async saveHandlebarHelpers(
      sourceCode: string,
      ctx: BebarHandlerContext,
      origin: string) {
    try {
      const hResult = await nodeEval(sourceCode, ctx.rootPath);
      for (let i = 0; i < Object.keys(hResult).length; i++) {
        const key = Object.keys(hResult)[i];
        Logger.info(this, `\t- ${key}`);
        this.helpers.push(new Helper(key, hResult[key], path.resolve(ctx.rootPath, origin)));
      }
    } catch (e) {
      const regexLine = /.*:(?<line>\d*)/mg;
      const matchLine = regexLine.exec((e as any).stack);
      const lineNumer = matchLine ? parseInt(matchLine[1]) : 0;
      const regexCols = /^\s*\^+/mg;
      const matchCol = regexCols.exec((e as any).stack)?.toString();
      DiagnosticBag.add(
          lineNumer-1,
          matchCol?.length! - matchCol?.trim().length!-1,
          lineNumer-1,
          matchCol?.length!-1,
          'Failed parsing helper file: ' + (e as any).message,
          DiagnosticSeverity.Error,
          path.resolve(ctx.rootPath, origin));
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

  /**
   * Handles a file change, a file content changed, ...
   * @param {RefreshContext} refreshContext The refresh context
   * @return {boolean} Returns true if the changed occurred in one of the helper files
   */
  public async handleRefresh(refreshContext: RefreshContext): Promise<boolean> {
    if (!this.helperset.file) return false;
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
    let result = false;

    const globResults = glob.sync(path.resolve(refreshContext.ctx.rootPath, this.helperset.file!));
    for (let i = 0; i< globResults.length; i++) {
      const globResult = globResults[i];

      if (PathUtils.pathsAreEqual(globResult, refreshContext.newFilePath!)) {
        this.helpers = this.helpers.filter((h) => !PathUtils.pathsAreEqual(h.origin, refreshContext.newFilePath!));
        await this.saveHandlebarHelpers(refreshContext.newFileContent!, refreshContext.ctx, refreshContext.newFilePath!);
        result = true;
      }
    }

    return result;
  }

  /**
   * Handles a new file creation
   * @param {RefreshContext} refreshContext The refresh context
   * @return {boolean} Returns true if the changed occurred in one of the partial files
   */
  private async handleFileCreated(refreshContext: RefreshContext): Promise<boolean> {
    let result = false;
    const globResults = glob.sync(path.resolve(refreshContext.ctx.rootPath, this.helperset.file!));
    for (let i = 0; i< globResults.length; i++) {
      const globResult = globResults[i];

      if (PathUtils.pathsAreEqual(globResult, refreshContext.newFilePath!)) {
        result = true;
        try {
          const fileContent = await readFile(globResult, this.helperset.encoding as BufferEncoding);
          await this.saveHandlebarHelpers(fileContent, refreshContext.ctx, globResult);
        } catch (e) {
          const ex = new HelperParsingException(this, e);
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
    if (!refreshContext.oldFilePath) return false;
    const beforeFilterCount = this.helpers.length;
    this.helpers = this.helpers.filter((h) => !PathUtils.pathsAreEqual(h.origin, refreshContext.oldFilePath!));
    return beforeFilterCount !== this.helpers.length;
  }

  /**
   * Handles a the move or rename of a file
   * @param {RefreshContext} refreshContext The refresh context
   * @return {boolean} Returns true if the changed occurred in one of the
   *  partial files
   */
  private async handleFileMovedOrRenamed(refreshContext: RefreshContext): Promise<Boolean> {
    const globResults = glob.sync(path.resolve(refreshContext.ctx.rootPath, this.helperset.file!));
    const foundInGlob = globResults.some((g: string) => PathUtils.pathsAreEqual(g, refreshContext.newFilePath!));
    const foundInActual = this.helpers.some((h) => PathUtils.pathsAreEqual(h.origin, refreshContext.oldFilePath!));

    if (!foundInActual && foundInGlob) {
      await this.handleFileCreated(refreshContext);
      return true;
    }

    if (foundInActual && !foundInGlob) {
      await this.handleFileDeleted(refreshContext);
      return true;
    }

    return false;
  }
};
