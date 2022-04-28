import {DatasetHandler} from './DatasetHandler';
import {Dataset} from '../../Models/Dataset';
import {FileDatasetFactory} from '../../Factories/FileDatasetFactory';
const glob = require('glob');
import path from 'path';
import {RefreshContext} from './../../Refresh/RefreshContext';
import {RefreshType} from './../../Refresh/RefreshType';
import {PathUtils} from '../../Utils/PathUtils';
import {FileDatasetHandler} from './FileDatasetHandler';
import {BebarHandlerContext} from '../Bebar/BebarHandlerContext';

/**
 * Dataset that can handle JS files
 */
export class MultipleFilesFileDatasetHandler extends DatasetHandler {
  /**
   * Indicates if this handler can handle the described Dataset object
   * @param {Dataset} dataset Object that will be transformed as a JSFileDataset
   * @param {BebarHandlerContext} ctx The bebar execution context
   * @return {boolean} True if this handler can handle the provided object
   */
  static canHandle(dataset: Dataset, ctx: BebarHandlerContext): boolean {
    if (!dataset || !dataset.file) return false;
    return (glob.sync(
        path.resolve(
            ctx.rootPath,
            dataset.file!))).length > 1;
  }

  /**
   * Reads data from the source
   * @param {BebarHandlerContext} ctx The bebar execution context
   * @return {any} The data extracted from the source
   */
  async load(ctx: BebarHandlerContext): Promise<any> {
    const handlerFiles = glob.sync(path.resolve(ctx.rootPath, this.dataset.file!));
    this.datasetHandlers = handlerFiles.map((f: string) => {
      const factory = new FileDatasetFactory(
          new Dataset({file: f}));
      factory.load(ctx);
      return factory.handler;
    })
        .filter((e: any | undefined) => e && e != undefined);
    this.content = {};
    for (let i = 0; i < this.datasetHandlers.length; i++) {
      const handler = this.datasetHandlers[i];
      if (handler) {
        await handler.load(ctx);
      }
    }

    return this.compileData();
  }

  /** Compiles data to be used by templates
   * @return {any} The compiled data
   */
  private compileData(): any {
    this.content = {};
    for (let i = 0; i < this.datasetHandlers.length; i++) {
      const handler = this.datasetHandlers[i];
      if (handler) {
        const handlerContent = handler.content;
        this.content = {
          ...this.content,
          ...handlerContent,
        };
      }
    };
    return this.content;
  }

  /**
   * Handles a file change, a file content changed, ...
   * @param {RefreshContext} refreshContext The refresh context
   * @return {boolean} Returns true if the changed occurred in one of the partial files
   */
  public async handleRefresh(refreshContext: RefreshContext): Promise<boolean> {
    if (!this.dataset.file) return false;
    switch (refreshContext.refreshType) {
      case RefreshType.FileContentChanged:
        if (await this.handleFileContentChanged(refreshContext)) {
          refreshContext.refreshedObjects.push(this);
          this.compileData();
        }
        break;
      case RefreshType.FileCreated:
        if (await this.handleFileCreated(refreshContext)) {
          refreshContext.refreshedObjects.push(this);
          this.compileData();
        }
        break;
      case RefreshType.FileDeleted:
        if (await this.handleFileDeleted(refreshContext)) {
          refreshContext.refreshedObjects.push(this);
          this.compileData();
        }
        break;
      case RefreshType.FileMovedOrRenamed:
        if (await this.handleFileMovedOrRenamed(refreshContext)) {
          refreshContext.refreshedObjects.push(this);
          this.compileData();
        }
        break;
    }
    return true;
  }

  /**
   * Handles a change in the content of a file
   * @param {RefreshContext} refreshContext The refresh context
   * @return {boolean} Returns true if the changed occurred in one of the partial files
   */
  private async handleFileContentChanged(refreshContext: RefreshContext): Promise<boolean> {
    for (let i = 0; i < this.datasetHandlers.length; i++) {
      const handler = this.datasetHandlers[i];
      if (await (handler as FileDatasetHandler).handleRefresh(refreshContext)) {
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
    const globResults = glob.sync(path.resolve(refreshContext.ctx.rootPath, this.dataset.file!));
    for (let i = 0; i< globResults.length; i++) {
      const globResult = globResults[i];

      if (PathUtils.pathsAreEqual(globResult, refreshContext.newFilePath!)) {
        result = true;
        const factory = new FileDatasetFactory(
            new Dataset({file: globResult}));
        factory.load(refreshContext.ctx);

        if (factory.handler) {
          await factory.handler.load(refreshContext.ctx);
          this.datasetHandlers.push(factory.handler);
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
    for (let i = 0; i < this.datasetHandlers.length; i++) {
      const handler = this.datasetHandlers[i];
      if (PathUtils.pathsAreEqual(path.resolve(refreshContext.ctx.rootPath, handler.dataset.file!), refreshContext.oldFilePath!)) {
        this.datasetHandlers.splice(i, 1);
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
    const fileDeletedResult = await this.handleFileDeleted(refreshContext);
    const fileCreatedResult = await this.handleFileCreated(refreshContext);
    return fileDeletedResult || fileCreatedResult;
  }
};
