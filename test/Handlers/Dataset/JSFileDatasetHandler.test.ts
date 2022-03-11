import {DatasetLoadingException}
  from '../../../src/Exceptions/DatasetLoadingException';
import {JSFileDatasetHandler}
  from '../../../src/Handlers/Dataset/JSFileDatasetHandler';
import {Dataset} from '../../../src/Models/Dataset';
import {MockAxios} from '../../Utils/MockAxios';

describe('JSFileDatasetHandler', () => {
  it('canHandle method should return true', () => {
    expect(JSFileDatasetHandler.canHandle(
        new Dataset({file: 'myfile.JS'}))).toBeTruthy();

    expect(JSFileDatasetHandler.canHandle(
        new Dataset({parseAs: 'js'}))).toBeTruthy();

    expect(JSFileDatasetHandler.canHandle(
        new Dataset({parseAs: 'javascript'}))).toBeTruthy();
  });

  it('canHandle method should return false', () => {
    expect(JSFileDatasetHandler.canHandle(
        new Dataset({file: 'myfile.jpg'}))).toBeFalsy();

    expect(JSFileDatasetHandler.canHandle(
        new Dataset({url: 'http://localhost/myfile.jpg'}))).toBeFalsy();
  });

  it('getData method should return data', async () => {
    const handler = new JSFileDatasetHandler(
        new Dataset({
          name: 'schools',
          file: './test/Assets/Datasets/schools.js',
        }),
    );
    const data = await handler.load('.');
    expect(data).toBeDefined();
    expect(data['schools']).toBe(handler.content['schools']);
    expect(data['schools'].length).toBe(10);
  });

  it('promise getData shoud return data', async () => {
    const handler = new JSFileDatasetHandler(
        new Dataset({
          name: 'schools',
          file: './test/Assets/Datasets/schools_promise.js',
        }),
    );
    const data = await handler.load('.');
    expect(data).toBeDefined();
    expect(data['schools']).toBe(handler.content['schools']);
    expect(data['schools'].length).toBe(10);
  });

  it('getData method should throw', async () => {
    const handler = new JSFileDatasetHandler(
        new Dataset({
          name: 'schools',
          file: './test/Assets/Datasets/missing_file.JS',
        }),
    );
    try {
      await handler.load('.');
      expect(false).toBeTruthy(); // We should never reach this point
    } catch (e) {
      expect(e).toBeInstanceOf(DatasetLoadingException);
      expect((e as DatasetLoadingException).inner).toBeDefined();
      expect((e as DatasetLoadingException).sender).toBe(handler);
    }
  });

  it('getData method should return data from HTTP', async () => {
    await MockAxios.mockUrl(
        '/schools.js',
        './test/Assets/Datasets/schools.js');
    const handler = new JSFileDatasetHandler(
        new Dataset({
          name: 'schools',
          parseAs: 'js',
          url: '/schools.js',
        }),
    );
    const data = await handler.load('.');
    expect(data).toBeDefined();
    expect(data['schools']).toBe(handler.content['schools']);
    expect(data['schools'].length).toBe(10);
  });
});
