import {DatasetHandler} from './DatasetHandler';
import {Dataset} from '../../Models/Dataset';
import {DatasetFactory} from '../../Factories/DatasetFactory';
import {FileDatasetHandlerTypes} from './DatasetHandlerTypes';
import {Settings} from '../../Utils/Settings';
import glob from 'glob';
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
            Settings.getInstance().workingDirectory,
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
          new Dataset({file: f}), FileDatasetHandlerTypes);
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
    handlers.forEach(async (h: any) => {
      if (h) {
        const handler = (h as any);
        const handlerContent = handler.content;
        this.content = {
          ...this.content,
          ...handlerContent,
        };
      }
    });
    return this.content;
  }
};
