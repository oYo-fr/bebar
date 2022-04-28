import {DatasetFactory} from '../../Factories/DatasetFactory';
import {Bebar} from '../../Models/Bebar';
import {DatasetHandler} from '../Dataset/DatasetHandler';
import {FileDatasetHandler} from '../Dataset/FileDatasetHandler';
import {MultipleFilesFileDatasetHandler} from '../Dataset/MultipleFilesFileDatasetHandler';
import {HelpersetHandler} from '../Helperset/HelpersetHandler';
import {PartialsetHandler} from '../Partialset/PartialsetHandler';
import {TemplateHandler} from '../Template/TemplateHandler';
import {RefreshContext} from './../../Refresh/RefreshContext';
import {RefreshType} from '../../Refresh/RefreshType';
const YAML = require('yaml');
const deepEqual = require('deep-equal');
import path from 'path';
import {PathUtils} from '../../Utils/PathUtils';
import {DiagnosticBag} from './../../Diagnostics/DiagnosticBag';
import {DiagnosticSeverity} from './../../Diagnostics/DiagnosticSeverity';
import {BebarHandlerContext} from './BebarHandlerContext';
import Handlebars from 'handlebars';
const glob = require('glob');
import util from 'util';
import fs from 'fs';
const readFile = util.promisify(fs.readFile);
import {Logger} from './../../Logging/Logger';
import {BebarLoopLoadingException} from '../../Exceptions/BebarLoopLoadingException';

/**
 * A bebar handler is reponsible for loading everything that migh be
 * set within a bebar file
 */
export class BebarHandler {
  public datasetHandlers: DatasetHandler[] = [];
  public partialsetHandlers: PartialsetHandler[] = [];
  public helpersetHandlers: HelpersetHandler[] = [];
  public templateHandlers: TemplateHandler[] = [];
  public allData: any = {};
  public keyToDataset: any | undefined = undefined;
  public importedBebarHandlers: BebarHandler[] = [];

  /**
   * Constructor.
   * @param {Bebar} Bebar Object that describes where to get the
   * @param {BebarHandlerContext} ctx The bebar execution context
   * @param {string[]} importsCallStack The list of bebar files that imported the currently created handlers
   */
  constructor(
    public bebar: Bebar,
    public ctx: BebarHandlerContext,
    public importsCallStack: string[] = []) {
  }

  /**
   * Creates handlers based on a filename pattern
   * @param {string} filenamePattern The filename pattern to match
   * @param {BebarHandlerContext} ctx The loading context
   * @param {string[]} importsCallStack The list of bebar files that imported the currently created handlers
   * @return {BebarHandler[]} The handlers that match the pattern
   */
  public static async create(filenamePattern: string, ctx: BebarHandlerContext, importsCallStack: string[] = []) : Promise<BebarHandler[]> {
    const result: BebarHandler[] = [];
    const files = glob.sync(path.join(ctx.rootPath, filenamePattern));

    if (files.length === 0) {
      DiagnosticBag.add(
          0, 0, 0, 0,
          `No files found parsing pattern : ${filenamePattern}`,
          DiagnosticSeverity.Warning,
          ctx.filename);
    }

    for (let i = 0; i < files.length; i++) {
      const file = path.resolve(files[i]);
      if (importsCallStack.some((f) => f === file)) {
        throw new BebarLoopLoadingException(this, undefined, importsCallStack);
      }
      const rootPath = path.resolve(path.dirname(file));
      Logger.info(this, `Loading bebar file ${file}`, '🚀');
      const bebarFileContent = await readFile(file, 'utf-8');

      let plainObject: any | undefined;
      try {
        plainObject = YAML.parse(bebarFileContent);
      } catch (ex) {
        DiagnosticBag.addByPosition(
            bebarFileContent,
            (ex as any).source.range.start,
            (ex as any).source.range.end,
            'Failed parsing bebar file: ' + (ex as any).message,
            DiagnosticSeverity.Error,
            file);
      }
      if (plainObject) {
        const bebar = new Bebar(plainObject);
        if (bebar) {
          const newCtx = new BebarHandlerContext(
              rootPath,
              file,
              ctx.cachePath.length === 0 ? rootPath : ctx.cachePath,
              ctx.cachePath.length === 0 ? rootPath : ctx.cachePath);
          const handler = new BebarHandler(bebar, newCtx, importsCallStack);
          result.push(handler);
        }
      }
    }
    return result;
  }

  /**
  * Reads data from the source
  * @return {any} The data extracted from the source
  */
  async load(): Promise<any> {
    this.allData = {};
    this.keyToDataset = {};
    await this.loadImports();
    await this.loadDatasets();
    await this.compileData();
    await this.loadHelpers();
    await this.loadPartials();
    await this.loadTemplates();
  }

  /** Loads imported files */
  private async loadImports() {
    if (this.bebar.imports) {
      for (let i = 0; i < this.bebar.imports.length; i++) {
        const importFile = this.bebar.imports[i];
        const ctx = new BebarHandlerContext(
            this.ctx.rootPath,
            importFile.file!,
            this.ctx.cachePath,
            this.ctx.outputPath);
        this.importedBebarHandlers = await BebarHandler.create(importFile.file!, ctx, this.importsCallStack.concat([this.ctx.filename]));
        for (let i = 0; i < this.importedBebarHandlers.length; i++) {
          try {
            const handler = this.importedBebarHandlers[i];
            await handler.load();
          } catch (ex) {
            DiagnosticBag.add(
                0, 0, 0, 0,
                'Failed parsing bebar file: ' + (ex as any).message,
                DiagnosticSeverity.Error,
                importFile.file ?? importFile.url!);
            throw ex;
          }
        }
      }
    }
  }

  /** Loads datasets */
  private async loadDatasets() {
    if (this.bebar.data) {
      for (let i = 0; i < this.bebar.data.length; i++) {
        const data = this.bebar.data[i];
        const factory = new DatasetFactory(data);
        factory.load(this.ctx);
        if (factory.handler) {
          try {
            const handler = factory.handler;
            await handler.load(this.ctx);
            this.datasetHandlers.push(handler);
          } catch { }
        }
      };
    }
  }

  /** Compiles data to be used by templates */
  private async compileData() {
    let importsData = {};
    this.keyToDataset = {};
    for (let c = 0; c < this.importedBebarHandlers.length; c++) {
      const subHandler = this.importedBebarHandlers[c];
      importsData = {
        ...importsData,
        ...subHandler.allData,
      };
      this.keyToDataset = {
        ...this.keyToDataset,
        ...subHandler.keyToDataset,
      };
    }
    this.allData = {
      ...importsData,
    };
    for (let i = 0; i < this.datasetHandlers.length; i++) {
      const handler = this.datasetHandlers[i];
      this.allData = {
        ...this.allData,
        ...handler.content,
      };
      if (handler.key) {
        this.keyToDataset[handler.key!] = handler.dataset;
      } else {
        if (handler.datasetHandlers) {
          for (let i = 0; i < handler.datasetHandlers.length; i++) {
            this.keyToDataset[handler.datasetHandlers[i].key!] = handler.datasetHandlers[i].dataset;
          }
        }
      }
    }
  }

  /** Loads helpers */
  private async loadHelpers() {
    if (this.bebar.helpers) {
      for (let i = 0; i < this.bebar.helpers.length; i++) {
        const helper = this.bebar.helpers[i];
        const helperHandler = new HelpersetHandler(helper);
        await helperHandler.load(this.ctx);
        this.helpersetHandlers.push(helperHandler);
      }
    }
  }

  /** Loads partials */
  private async loadPartials() {
    if (this.bebar.partials) {
      for (let i = 0; i < this.bebar.partials.length; i++) {
        const partial = this.bebar.partials[i];
        const partialHandler = new PartialsetHandler(partial);
        await partialHandler.load(this.ctx);
        this.partialsetHandlers.push(partialHandler);
      }
    }
  }

  /** Loads templates */
  private async loadTemplates() {
    for (let c = 0; c < this.importedBebarHandlers.length; c++) {
      const subHandler = this.importedBebarHandlers[c];
      if (subHandler.templateHandlers) {
        for (let h = 0; h < subHandler.templateHandlers.length; h++) {
          const handler = subHandler.templateHandlers[h];
          handler.loadHelpersAndPartials(subHandler.ctx);
        }
      }
      if (subHandler.helpersetHandlers) {
        for (let h = 0; h < subHandler.helpersetHandlers.length; h++) {
          const handler = subHandler.helpersetHandlers[h];
          handler.registerHelpers(this.ctx.bebarHandlebarsContext);
        }
      }
      if (subHandler.partialsetHandlers) {
        for (let h = 0; h < subHandler.partialsetHandlers.length; h++) {
          const handler = subHandler.partialsetHandlers[h];
          handler.registerPartials(this.ctx.bebarHandlebarsContext);
        }
      }
    }
    if (this.bebar.templates) {
      for (let i = 0; i < this.bebar.templates.length; i++) {
        const template = this.bebar.templates[i];
        const templateHandler = new TemplateHandler(
            template,
            Handlebars.create());
        this.templateHandlers.push(templateHandler);
      }
      for (let i = 0; i < this.templateHandlers.length; i++) {
        const templateHandler = this.templateHandlers[i];
        await templateHandler.loadHelpersAndPartials(this.ctx);

        for (let j = 0; j < this.helpersetHandlers.length; j++) {
          this.helpersetHandlers[j].registerHelpers(templateHandler.handlebars);
        }
        for (let j = 0; j < templateHandler.helpersetHandlers.length; j++) {
          templateHandler.helpersetHandlers[j].registerHelpers(templateHandler.handlebars);
        }

        for (let j = 0; j < this.partialsetHandlers.length; j++) {
          this.partialsetHandlers[j].registerPartials(templateHandler.handlebars);
        }
        for (let j = 0; j < templateHandler.partialsetHandlers.length; j++) {
          templateHandler.partialsetHandlers[j].registerPartials(templateHandler.handlebars);
        }

        templateHandler.bebarData = {
          ...this.allData,
        };
        templateHandler.bebarKeyToDataset = {
          ...this.keyToDataset,
        };
        await templateHandler.load(this.ctx);
      }
    }
  }

  /**
   * Handles a file change, a file content changed, ...
   * @param {RefreshContext} refreshContext The refresh context
   */
  public async handleRefresh(refreshContext: RefreshContext): Promise<boolean> {
    DiagnosticBag.clear();

    let refreshOnImports = false;
    for (let c = 0; c < this.importedBebarHandlers.length; c++) {
      refreshOnImports = (await this.importedBebarHandlers[c].handleRefresh(refreshContext)) || refreshOnImports;
    }

    if (refreshContext.refreshType === RefreshType.FileContentChanged &&
      await this.handleFileContentChanged(refreshContext)) {
      refreshContext.refreshedObjects.push(this);
      return true;
    }

    let refreshOnPartials = false;
    for (let i = 0; i < this.partialsetHandlers.length; i++) {
      const partialsetHandler = this.partialsetHandlers[i];
      if (await partialsetHandler.handleRefresh(refreshContext)) {
        refreshOnPartials = true;
        refreshContext.refreshedObjects.push(this);
      }
    }

    if (refreshOnPartials) {
      for (let i = 0; i < this.partialsetHandlers.length; i++) {
        for (let j = 0; j < this.templateHandlers.length; j++) {
          const partialsetHandler = this.partialsetHandlers[i];
          const templateHandler = this.templateHandlers[j];
          partialsetHandler.unload(templateHandler.handlebars);
          partialsetHandler.registerPartials(templateHandler.handlebars);
        }
      }
    }

    let refreshOnHelpers = false;
    for (let i = 0; i < this.helpersetHandlers.length; i++) {
      const helpersetHandler = this.helpersetHandlers[i];
      if (await helpersetHandler.handleRefresh(refreshContext)) {
        refreshOnHelpers = true;
        if (!refreshOnPartials) {
          refreshContext.refreshedObjects.push(this);
        }
      }
    }

    if (refreshOnHelpers) {
      for (let i = 0; i < this.helpersetHandlers.length; i++) {
        for (let j = 0; j < this.templateHandlers.length; j++) {
          const helpersetHandler = this.helpersetHandlers[i];
          const templateHandler = this.templateHandlers[j];
          helpersetHandler.unload(templateHandler.handlebars);
          helpersetHandler.registerHelpers(templateHandler.handlebars);
        }
      }
    }

    let refreshOnData = false;
    for (let i = 0; i < this.datasetHandlers.length; i++) {
      const datasetHandler = this.datasetHandlers[i];
      if ((<FileDatasetHandler> this.datasetHandlers[0]).handleRefresh !== undefined &&
        await (datasetHandler as FileDatasetHandler).handleRefresh(refreshContext)) {
        refreshOnData = true;
        if (!refreshOnPartials && !refreshOnHelpers) {
          refreshContext.refreshedObjects.push(this);
        }
      }
      if ((<MultipleFilesFileDatasetHandler> this.datasetHandlers[0]).handleRefresh !== undefined &&
        await (datasetHandler as MultipleFilesFileDatasetHandler).handleRefresh(refreshContext)) {
        refreshOnData = true;
        if (!refreshOnPartials && !refreshOnHelpers) {
          refreshContext.refreshedObjects.push(this);
        }
      }
    }
    if (refreshOnImports || refreshOnData) {
      await this.compileData();
    }

    let refreshOnTemplates = false;
    for (let i = 0; i < this.templateHandlers.length; i++) {
      const templateHandler = this.templateHandlers[i];
      templateHandler.bebarData = {
        ...this.allData,
      };
      templateHandler.bebarKeyToDataset = {
        ...this.keyToDataset,
      };
      if (await templateHandler.handleRefresh(refreshContext, refreshOnImports || refreshOnPartials || refreshOnHelpers || refreshOnData)) {
        refreshOnTemplates = true;
        if (!refreshOnPartials && !refreshOnHelpers && !refreshOnData) {
          refreshContext.refreshedObjects.push(this);
        }
      }
    }
    return refreshOnImports || refreshOnPartials || refreshOnHelpers || refreshOnData || refreshOnTemplates;
  }

  /**
   * Handles a change in the content of a file
   * @param {RefreshContext} refreshContext The refresh context
   * @return {boolean} Returns true if the changed occurred in one of the partial files
   */
  private async handleFileContentChanged(refreshContext: RefreshContext): Promise<boolean> {
    if (PathUtils.pathsAreEqual(path.resolve(refreshContext.ctx.rootPath, this.ctx.filename), refreshContext.newFilePath!)) {
      let result = false;
      let plainObject: any | undefined;
      try {
        plainObject = YAML.parse(refreshContext.newFileContent);
      } catch (ex) {
        DiagnosticBag.addByPosition(
            refreshContext.newFileContent!,
            (ex as any).source.range.start,
            (ex as any).source.range.end,
            'Failed parsing bebar file: ' + (ex as any).message,
            DiagnosticSeverity.Error,
            path.resolve(refreshContext.ctx.rootPath, this.ctx.filename));
      }

      if (!plainObject) return true;

      const newBebar = new Bebar(plainObject);

      if (!deepEqual(this.bebar.imports, newBebar.imports)) {
        result = true;
        this.bebar.imports = newBebar.imports;
        this.importedBebarHandlers = [];
        await this.loadImports();
      }

      if (!deepEqual(this.bebar.helpers, newBebar.helpers)) {
        result = true;
        for (let i = 0; i < this.helpersetHandlers.length; i++) {
          for (let j = 0; j < this.templateHandlers.length; j++) {
            await this.helpersetHandlers[i].unload(this.templateHandlers[j].handlebars);
          }
        }
        this.bebar.helpers = newBebar.helpers;
        this.helpersetHandlers = [];
        await this.loadHelpers();
      }

      if (!deepEqual(this.bebar.partials, newBebar.partials)) {
        result = true;
        for (let i = 0; i < this.partialsetHandlers.length; i++) {
          for (let j = 0; j < this.templateHandlers.length; j++) {
            await this.partialsetHandlers[i].unload(this.templateHandlers[j].handlebars);
          }
        }
        this.bebar.partials = newBebar.partials;
        this.partialsetHandlers = [];
        await this.loadPartials();
      }

      if (!deepEqual(this.bebar.data, newBebar.data)) {
        result = true;
        this.bebar.data = newBebar.data;
        this.datasetHandlers = [];
        await this.loadDatasets();
        await this.compileData();
      }

      if (result || !deepEqual(this.bebar.templates, newBebar.templates)) {
        result = true;
        for (let i = 0; i < this.templateHandlers.length; i++) {
          await this.templateHandlers[i].unload();
        }
        this.bebar.templates = newBebar.templates;
        this.templateHandlers = [];
        await this.loadTemplates();
      }

      return result;
    }
    return false;
  }
};
