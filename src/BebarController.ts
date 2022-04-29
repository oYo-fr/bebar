import {BebarHandler} from './Handlers/Bebar/BebarHandler';
import {OutputWritingException} from './Exceptions/OutputWritingException';
import {Logger} from './Logging/Logger';
import path from 'path';
import util from 'util';
import fs from 'fs';
const writeFile = util.promisify(fs.writeFile);
import {DiagnosticBag} from './Diagnostics/DiagnosticBag';
import {BebarHandlerContext} from './Handlers/Bebar/BebarHandlerContext';
import {DiagnosticSeverity} from './Diagnostics/DiagnosticSeverity';
import {BebarLoopLoadingException} from './Exceptions/BebarLoopLoadingException';

/**
 * Main class for command line call
 */
export class BebarController {
  public handlers: BebarHandler[] = [];

  /**
   * Constructor
   */
  public constructor() { }

  /**
   * Loads a bebar file
   * @param {string} filenamePattern Name of the bebar file(s) to run
   * (can contain wildcards)
   */
  public async load(filenamePattern: string) {
    DiagnosticBag.clear();
    this.handlers = await BebarHandler.create(filenamePattern, new BebarHandlerContext('', ''));
    for (let i = 0; i < this.handlers.length; i++) {
      try {
        await this.handlers[i].load();
      } catch (ex) {
        if ((ex as any).importsCallStack) {
          DiagnosticBag.add(
              0, 0, 0, 0,
              'Imports loop detected: ' + (ex as BebarLoopLoadingException).importsCallStack.join(' --> '),
              DiagnosticSeverity.Error,
              this.handlers[i].ctx.filename);
        }
        throw ex;
      }
    }
  }

  /**
   * Writes all output files
   */
  public async writeFiles() {
    for (let i = 0; i < this.handlers.length; i++) {
      const bebarhandler = this.handlers[i];
      await BebarController.writeFilesForHandler(bebarhandler);
    }
  }

  /**
   * Writes all output files for one bebar handler
   * @param {BebarHandler} bebarhandler Bebar handler to write files for
   */
  private static async writeFilesForHandler(bebarhandler: BebarHandler) {
    if (bebarhandler.importedBebarHandlers) {
      for (let i = 0; i < bebarhandler.importedBebarHandlers.length; i++) {
        const subHandler = bebarhandler.importedBebarHandlers[i];
        await BebarController.writeFilesForHandler(subHandler);
      }
    }
    for (let j = 0; j < bebarhandler.templateHandlers.length; j++) {
      const templateHandler = bebarhandler.templateHandlers[j];
      for (let o = 0; o < templateHandler.outputs.length; o++) {
        const output = templateHandler.outputs[o];
        if (output.file) {
          const p = bebarhandler.ctx.outputPath ?
            path.resolve(bebarhandler.ctx.outputPath, output.file) :
            output.file;
          Logger.info(this, `Writing result file ${p}`, '🖊️ ');
          try {
            fs.mkdirSync(path.dirname(p), {recursive: true});
            await writeFile(p, output.content);
          } catch (e) {
            const ex = new OutputWritingException(this, e);
            Logger.error(this, 'Failed writing output file', ex);
            throw ex;
          }
        }
      }
    }
  }
}
