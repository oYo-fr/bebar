import {BebarHandler} from './Handlers/Bebar/BebarHandler';
import {Converter} from './Utils/Converter';
import path from 'path';
import glob from 'glob';
import YAML from 'yaml';
import util from 'util';
import fs from 'fs';
import {Settings} from './Utils/Settings';
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

/**
 * Main class for command line call
 */
export class App {
  public handlers: BebarHandler[] = [];
  /**
   *Main app method
   * @param {string} workdir Working directory
   * @param {string} filename Name of the bebar file(s) to run (can contain
   *  wildcards)
   */
  public async run(workdir: string, filename: string) {
    Settings.getInstance().workingDirectory = workdir;
    const files = glob
        .sync(path.resolve(workdir, filename));

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const bebarFileContent = await readFile(
          path.resolve(workdir, file),
          'utf-8',
      );
      const plainObject = YAML.parse(bebarFileContent);
      const bebar =
        Converter.toBebar(plainObject);
      if (bebar) {
        const handler = new BebarHandler(bebar!);
        await handler.load();
        this.handlers.push(handler);
      }
    }

    for (let i = 0; i < this.handlers.length; i++) {
      const bebarhandler = this.handlers[i];
      for (let j = 0; j < bebarhandler.templateHandlers.length; j++) {
        const templateHandler = bebarhandler.templateHandlers[i];
        for (let o = 0; o < templateHandler.outputs.length; o++) {
          const output = templateHandler.outputs[o];
          if (output.file) {
            const p = path.resolve(workdir, output.file);
            fs.mkdirSync(path.dirname(p), {recursive: true});
            await writeFile(p, output.content);
          }
        }
      }
    }
  }
}
