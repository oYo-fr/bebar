import {RawFileDatasetHandler}
  from '../../../src/Handlers/Dataset/RawFileDatasetHandler';
import {Dataset} from '../../../src/Models/Dataset';
import {MockAxios} from '../../Utils/MockAxios';

describe('RawFileDatasetHandler', () => {
  it('canHandle method should return true', () => {
    expect(RawFileDatasetHandler.canHandle(
        new Dataset({
          file: 'myfile.txt',
          name: 'test',
          parseAs: 'raw',
        })))
        .toBeTruthy();
  });

  it('canHandle method should return false', () => {
    expect(RawFileDatasetHandler.canHandle(
        new Dataset({
          file: 'myfile.txt',
        })))
        .toBeFalsy();

    expect(RawFileDatasetHandler.canHandle(
        new Dataset({
          file: 'myfile.txt',
          parseAs: 'raw',
        })))
        .toBeTruthy();
  });

  it('getData method should return data', async () => {
    const handler = new RawFileDatasetHandler(
        new Dataset({
          name: 'schools',
          file: './test/Assets/Datasets/schools.html',
          parseAs: 'raw',
        }));
    const data = await handler.load('.');
    expect(data).toBeDefined();
    expect(data['schools']).toBeDefined();
    expect(data['schools'].length).toBeGreaterThan(0);
  });

  it('getData method should return data from HTTP', async () => {
    await MockAxios.mockUrl(
        '/schools.html',
        './test/Assets/Datasets/schools.html');
    const handler = new RawFileDatasetHandler(new Dataset({
      name: 'schools',
      url: 'schools.html',
      parseAs: 'raw',
    }));
    const data = await handler.load('.');
    expect(data).toBeDefined();
    expect(data['schools']).toBeDefined();
    expect(data['schools'].length).toBeGreaterThan(0);
  });
});
