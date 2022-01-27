import {DatasetException} from '../../../src/Exceptions/DatasetException';
import {YamlFileDatasetHandler}
  from '../../../src/Handlers/Dataset/YamlFileDatasetHandler';
import {Dataset} from '../../../src/Models/Dataset';
import {MockAxios} from '../../Utils/MockAxios';

describe('YamlFileDatasetHandler', () => {
  test('canHandle method should return true', () => {
    expect(YamlFileDatasetHandler.canHandle(
        new Dataset({file: 'myfile.yml'})))
        .toBeTruthy();

    expect(YamlFileDatasetHandler.canHandle(
        new Dataset({file: 'myfile.yaml'})))
        .toBeTruthy();

    expect(YamlFileDatasetHandler.canHandle(
        new Dataset({parseAs: 'yml'})))
        .toBeTruthy();

    expect(YamlFileDatasetHandler.canHandle(
        new Dataset({parseAs: 'yaml'})))
        .toBeTruthy();
  });

  test('canHandle method should return false', () => {
    expect(YamlFileDatasetHandler.canHandle(
        new Dataset({file: 'myfile.jpg'})))
        .toBeFalsy();

    expect(YamlFileDatasetHandler.canHandle(
        new Dataset({url: 'http://localhost/myfile.jpg'})))
        .toBeFalsy();

    expect(YamlFileDatasetHandler.canHandle(null)).toBeFalsy();
    expect(YamlFileDatasetHandler.canHandle(undefined)).toBeFalsy();
  });

  test('getData method should return data', async () => {
    const handler = new YamlFileDatasetHandler(
        new Dataset({
          name: 'schools',
          file: './test/Assets/Datasets/schools.yaml',
          options: {
            prettyErrors: false,
          },
        }),
    );
    const data = await handler.load();
    expect(data).toBeDefined();
    expect(data['schools']).toBe(handler.content['schools']);
    expect(data['schools'].length).toBe(10);
  });

  test('getData method should read utf-16', async () => {
    const handler = new YamlFileDatasetHandler(
        new Dataset({
          name: 'schools',
          file: './test/Assets/Datasets/schools_utf-16.yaml',
          encoding: 'utf16le',
        }),
    );
    const data = await handler.load();
    expect(data).toBeDefined();
    expect(data['schools']).toBe(handler.content['schools']);
    expect(data['schools'].length).toBe(10);
  });

  test('getData method should throw', async () => {
    const handler = new YamlFileDatasetHandler(
        new Dataset({
          name: 'schools',
          file: './test/Assets/Datasets/missing_file.yaml',
        }),
    );
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
        '/schools.yaml',
        './test/Assets/Datasets/schools.yaml');
    const handler = new YamlFileDatasetHandler(new Dataset({
      name: 'schools',
      url: '/schools.yaml',
      parseAs: 'yaml',
      options: {
        prettyErrors: false,
      },
    }));
    const data = await handler.load();
    expect(data).toBeDefined();
    expect(data['schools']).toBe(handler.content['schools']);
    expect(data['schools'].length).toBe(10);
  });
});
