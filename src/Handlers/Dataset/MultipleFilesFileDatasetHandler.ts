import {DatasetHandler} from './DatasetHandler';
import {Dataset} from '../../Models/Dataset';
import {DatasetFactory} from '../../Factories/DatasetFactory';
import {Settings} from '../../Utils/Settings';
const glob = require('glob');
import path from 'path';

/**
 * Dataset that can handle JS files
 */
export class MultipleFilesFileDatasetHandler
  extends DatasetHandler {
  /**
   * Indicates if this handler can handle the described Dataset object
   * @param {Dataset} dataset Object that will be transformed as a JSFileDataset
   * @return {boolean} True if this handler can handle the provided object
   */
  static canHandle(dataset: Dataset): boolean {
    return (glob.sync(
        path.resolve(
            Settings.workingDirectory,
            dataset.file!))).length > 1;
  }

  /**
   * Reads data from the source
   * @return {any} The data extracted from the source
   */
  async load(): Promise<any> {
    const handlerFiles = glob.sync(path.resolve('.', this.dataset.file!));
    const handlers = handlerFiles.map((f: string) => {
      const factory = new DatasetFactory(
          new Dataset({file: f}), false);
      factory.load();
      return factory.handler;
    })
        .filter((e: any | undefined) => e && e != undefined);
    this.content = {};
    for (let i = 0; i < handlers.length; i++) {
      const handler = handlers[i];
      if (handler) {
        await handler.load();
      }
    }
    // await Promise.all(handlers.map((h: { load: () => any; }) => h.load()));
    for (let i = 0; i < handlers.length; i++) {
      const handler = handlers[i];
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
};
