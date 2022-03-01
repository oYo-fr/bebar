import {FileDatasetHandler} from './FileDatasetHandler';
const YAML = require('yaml');

/**
 * Dataset that can handle Yaml files
 */
export class YamlFileDatasetHandler extends FileDatasetHandler {
  /**
   * Indicates if this handler can handle the described Dataset object
   * @param {any} dataset Object that will be transformed as a YamlFileDataset
   * @return {boolean} True if this handler can handle the provided object
   */
  static canHandle(dataset: any): boolean {
    return FileDatasetHandler.checkParseAsOrFileExtension(dataset, 'yml') ||
    FileDatasetHandler.checkParseAsOrFileExtension(dataset, 'yaml');
  }

  /**
   * Reads data from the source
   * @return {any} The data extracted from the source
   */
  async load(): Promise<any> {
    return await super.loadWithParser(YAML.parse);
  }
};
