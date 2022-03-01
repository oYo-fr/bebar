import {BebarException} from '../../../src/Exceptions/BebarException';
import {JSonFileDatasetHandler}
  from '../../../src/Handlers/Dataset/JSonFileDatasetHandler';
import {Dataset} from '../../../src/Models/Dataset';
import {MockAxios} from '../../Utils/MockAxios';

describe('JSonFileDatasetHandler', () => {
  it('handler should return true on provided object', () => {
    expect(JSonFileDatasetHandler.canHandle(
        new Dataset({file: 'myfile.jSoN'}))).toBeTruthy();

    expect(JSonFileDatasetHandler.canHandle(
        new Dataset({parseAs: 'JSon'}))).toBeTruthy();
  });

  it('handler should return false on provided object', () => {
    expect(JSonFileDatasetHandler.canHandle(
        new Dataset({file: 'myfile.jpg'}))).toBeFalsy();

    expect(JSonFileDatasetHandler.canHandle(
        new Dataset({url: 'http://localhost/myfile.jpg'}))).toBeFalsy();
  });

  it('JSonFileDatasetHandler getData method should return data', async () => {
    const handler = new JSonFileDatasetHandler(
        new Dataset({
          name: 'schools',
          file: './test/Assets/Datasets/schools.json',
        }),
    );
    const data = await handler.load();
    expect(data).toBeDefined();
    expect(data['schools']).toBe(handler.content['schools']);
    expect(data['schools'].length).toBe(10);
  });

  it('JSonFileDatasetHandler getData method should throw', async () => {
    const handler = new JSonFileDatasetHandler(
        new Dataset({
          name: 'schools',
          file: './test/Assets/Datasets/missing_file.JSon',
        }),
    );
    try {
      await handler.load();
      expect(false).toBeTruthy(); // We should never reach this point
    } catch (e) {
      expect((e as BebarException).inner).toBeDefined();
      expect((e as BebarException).sender).toBe(handler);
    }
  });

  it('getData method should return data from HTTP', async () => {
    await MockAxios.mockUrl(
        '/schools.json',
        './test/Assets/Datasets/schools.json');
    const handler = new JSonFileDatasetHandler(
        new Dataset({
          name: 'schools',
          parseAs: 'json',
          url: '/schools.json',
        }),
    );
    const data = await handler.load();
    expect(data).toBeDefined();
    expect(data['schools']).toBe(handler.content['schools']);
    expect(data['schools'].length).toBe(10);
  });
});
