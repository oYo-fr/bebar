import {DatasetException} from '../../../src/Exceptions/DatasetException';
import {CSVFileDatasetHandler}
  from '../../../src/Handlers/Dataset/CSVFileDatasetHandler';
import {Dataset} from '../../../src/Models/Dataset';
import {MockAxios} from '../../Utils/MockAxios';

describe('CSVFileDatasetHandler', () => {
  test('canHandle method should return true', () => {
    expect(CSVFileDatasetHandler.canHandle(
        new Dataset({file: 'myfile.CSV'}))).toBeTruthy();

    expect(CSVFileDatasetHandler.canHandle(
        new Dataset({parseAs: 'CSV'}))).toBeTruthy();

    expect(CSVFileDatasetHandler.canHandle(
        new Dataset({parseAs: 'CsV'}))).toBeTruthy();
  });

  test('canHandle method should return false', () => {
    expect(CSVFileDatasetHandler.canHandle(
        new Dataset({file: 'myfile.jpg'}))).toBeFalsy();

    expect(CSVFileDatasetHandler.canHandle(
        new Dataset({url: 'http://localhost/myfile.jpg'}))).toBeFalsy();
  });

  test('getData method should return data', async () => {
    const handler = new CSVFileDatasetHandler(new Dataset({
      name: 'schools',
      file: './test/Assets/Datasets/schools.csv',
      options: {
        separator: ';',
      },
    }));
    const data = await handler.load();
    expect(data).toBeDefined();
    expect(data['schools']).toBe(handler.content['schools']);
    expect(data['schools'].length).toBe(10);
  });

  test('getData method should throw', async () => {
    const handler = new CSVFileDatasetHandler(new Dataset({
      name: 'schools',
      file: './test/Assets/Datasets/missing_file.CSV',
      options: {
        separator: ';',
      },
    }));
    try {
      await handler.load();
      expect(false).toBeTruthy(); // We should never reach this point
    } catch (e) {
      expect(e).toBeInstanceOf(DatasetException);
      expect((e as DatasetException).inner).toBeDefined();
      expect((e as DatasetException).sender).toBe(handler);
    }
  });

  test('getData method should return data from HTTP', async () => {
    await MockAxios.mockUrl(
        '/schools.csv',
        './test/Assets/Datasets/schools.csv');
    const handler = new CSVFileDatasetHandler(
        new Dataset({
          name: 'schools',
          url: '/schools.csv',
          options: {
            separator: ';',
          },
        }),
    );
    const data = await handler.load();
    expect(data).toBeDefined();
    expect(data['schools']).toBe(handler.content['schools']);
    expect(data['schools'].length).toBe(10);
  });
});
