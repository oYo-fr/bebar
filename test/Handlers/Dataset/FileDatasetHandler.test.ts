import {FileDatasetHandler}
  from '../../../src/Handlers/Dataset/FileDatasetHandler';
import {Dataset} from '../../../src/Models/Dataset';

/**
 * Sample dummy FileDatasetHandler class
 */
class DummyFileDatasetHandler extends FileDatasetHandler {
}

describe('FileDatasetHandler', () => {
  test('should give have a default name', () => {
    const handler = new DummyFileDatasetHandler(
        new Dataset({file: './test/Assets/Datasets/schools.csv'}));
    expect(handler.dataset.name).toBe('schools');

    const handler2 = new DummyFileDatasetHandler(
        new Dataset({
          file: './test/Assets/Datasets/schools.csv',
          name: '',
        }));
    expect(handler2.dataset.name).toBe('schools');
  });
});
