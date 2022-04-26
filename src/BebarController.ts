import {BebarHandler} from './Handlers/Bebar/BebarHandler';
import {OutputWritingException} from './Exceptions/OutputWritingException';
import {Logger} from './Logging/Logger';
import path from 'path';
import util from 'util';
import fs from 'fs';
const writeFile = util.promisify(fs.writeFile);
import {DiagnosticBag} from './Diagnostics/DiagnosticBag';
import {BebarHandlerContext} from './Handlers/Bebar/BebarHandlerContext';

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
      await this.handlers[i].load();
    }
  }

  /**
   * Writes all output files
   */
  public async writeFiles() {
    for (let i = 0; i < this.handlers.length; i++) {
      const bebarhandler = this.handlers[i];
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
}
