import {FileDatasetHandler} from './FileDatasetHandler';
import {XMLParser} from 'fast-xml-parser';

/**
 * Dataset that can handle Xml files
 */
export class XmlFileDatasetHandler extends FileDatasetHandler {
  /**
   * Indicates if this handler can handle the described Dataset object
   * @param {any} dataset Object that will be transformed as a XmlFileDataset
   * @return {boolean} True if this handler can handle the provided object
   */
  static canHandle(dataset: any): boolean {
    return FileDatasetHandler.checkParseAsOrFileExtension(dataset, 'xml');
  }

  /**
   * Reads data from the source
   * @return {any} The data extracted from the source
   */
  async load(): Promise<any> {
    return await super.loadWithParser(this.parse);
  }

  /**
   * Parses the content of the file
   * @param {string} data The data to parse
   * @param {any} options Options to pass to the csv library
   */
  private async parse(data: string, options?: any): Promise<any> {
    return new Promise((resolve) => {
      const parser = new XMLParser(options);
      resolve(parser.parse(data));
    });
  }
};
