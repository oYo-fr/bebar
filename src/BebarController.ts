import {Bebar} from './Models/Bebar';
import {BebarHandler} from './Handlers/Bebar/BebarHandler';
import {OutputWritingException} from './Exceptions/OutputWritingException';
import {Logger} from './Logging/Logger';
import path from 'path';
const glob = require('glob');
const YAML = require('yaml');
import util from 'util';
import fs from 'fs';
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
import {DiagnosticBag} from './Diagnostics/DiagnosticBag';
import {DiagnosticSeverity} from './Diagnostics/DiagnosticSeverity';
import {BebarHandlerContext} from './Handlers/Bebar/BebarHandlerContext';

/**
 * Main class for command line call
 */
export class BebarController {
  public handlers: BebarHandler[] = [];

  /**
   * Constructor
   * @param {string} workdir Working directory
   */
  public constructor(public workdir: string | undefined) { }

  /**
   * Loads a bebar file
   * @param {string} filenamePattern Name of the bebar file(s) to run
   * (can contain wildcards)
   */
  public async load(filenamePattern: string) {
    DiagnosticBag.clear();
    const rootPath = this.workdir ?
      this.workdir :
      path.dirname(filenamePattern);
    const files = glob.sync(this.workdir ?
      path.resolve(this.workdir, filenamePattern) :
      filenamePattern);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      Logger.info(this, `Loading bebar file ${file}`, '🚀');
      const bebarFileContent = await readFile(path.resolve(rootPath, file),
          'utf-8',
      );

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
            path.resolve(rootPath, file));
      }
      if (plainObject) {
        const bebar =
            new Bebar(plainObject);
        if (bebar) {
          const handler = new BebarHandler(bebar!, new BebarHandlerContext(rootPath, file));
          await handler.load();
          this.handlers.push(handler);
        }
      }
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
            const p = this.workdir ?
              path.resolve(this.workdir, output.file) :
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
