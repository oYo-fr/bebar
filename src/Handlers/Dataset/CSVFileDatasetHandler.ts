import {FileDatasetHandler} from './FileDatasetHandler';
import {Dataset} from '../../Models/Dataset';
import csv from 'csv-parser';
import stream from 'stream';
const Readable = stream.Readable;

/**
 * Dataset that can handle CSV files
 */
export class CSVFileDatasetHandler extends FileDatasetHandler {
  /**
   * Indicates if this handler can handle the described Dataset object
   * @param {Dataset} dataset Object that will be transformed as a
   *  CSVFileDataset
   * @return {boolean} True if this handler can handle the provided object
   */
  static canHandle(dataset: Dataset): boolean {
    return FileDatasetHandler.checkParseAsOrFileExtension(dataset, 'csv');
  }

  /**
   * Reads data from the source
   * @param {string} rootPath The folder where the bebar file is
   * @return {any} The data extracted from the source
   */
  async load(rootPath: string): Promise<any> {
    this.parser = this.parse;
    return await super.loadData(rootPath, undefined);
  }

  /**
   * Parses the content of the file
   * @param {string} data The data to parse
   * @param {any} options Options to pass to the csv library
   */
  private async parse(
      data: string, options?: any): Promise<any> {
    return new Promise((resolve) => {
      const results: any[] = [];
      const s = new Readable();
      s.push(data);
      s.push(null);
      s.pipe(csv(options))
          .on('data', (data: any) => results.push(data))
          .on('end', () => {
            resolve(results);
          });
    });
  }
};
