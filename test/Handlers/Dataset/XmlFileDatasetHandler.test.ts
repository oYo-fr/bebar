import {DatasetException} from '../../../src/Exceptions/DatasetException';
import {XmlFileDatasetHandler}
  from '../../../src/Handlers/Dataset/XmlFileDatasetHandler';
import {Dataset} from '../../../src/Models/Dataset';
import {MockAxios} from '../../Utils/MockAxios';

describe('XmlFileDatasetHandler', () => {
  test('canHandle method should return true', () => {
    expect(XmlFileDatasetHandler.canHandle(
        new Dataset({file: 'myfile.xml'})))
        .toBeTruthy();

    expect(XmlFileDatasetHandler.canHandle(
        new Dataset({parseAs: 'xml'})))
        .toBeTruthy();
  });

  test('canHandle method should return false', () => {
    expect(XmlFileDatasetHandler.canHandle(
        new Dataset({file: 'myfile.jpg'})))
        .toBeFalsy();

    expect(XmlFileDatasetHandler.canHandle(
        new Dataset({url: 'http://localhost/myfile.jpg'})))
        .toBeFalsy();

    expect(XmlFileDatasetHandler.canHandle(null)).toBeFalsy();
    expect(XmlFileDatasetHandler.canHandle(undefined)).toBeFalsy();
  });

  test('getData method should return data', async () => {
    const handler = new XmlFileDatasetHandler(
        new Dataset({
          name: 'schools',
          file: './test/Assets/Datasets/schools.xml',
        }));
    const data = await handler.load();
    expect(data).toBeDefined();
    expect(data['schools'].root.row).toBe(handler.content['schools'].root.row);
    expect(data['schools'].root.row.length).toBe(10);
  });

  test('getData method should throw', async () => {
    const handler = new XmlFileDatasetHandler(
        new Dataset({
          name: 'schools',
          file: './test/Assets/Datasets/missing_file.xml',
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
        '/schools.xml',
        './test/Assets/Datasets/schools.xml');
    const handler = new XmlFileDatasetHandler(new Dataset({
      name: 'schools',
      parseAs: 'xml',
      url: '/schools.xml',
    }));
    const data = await handler.load();
    expect(data).toBeDefined();
    expect(data['schools'].root.row).toBe(handler.content['schools'].root.row);
    expect(data['schools'].root.row.length).toBe(10);
  });
});
