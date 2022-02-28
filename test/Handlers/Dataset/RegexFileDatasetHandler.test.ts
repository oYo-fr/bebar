import {DatasetException} from '../../../src/Exceptions/DatasetException';
import {RegexFileDatasetHandler}
  from '../../../src/Handlers/Dataset/RegexFileDatasetHandler';
import {Dataset} from '../../../src/Models/Dataset';
import {MockAxios} from '../../Utils/MockAxios';

describe('RegexFileDatasetHandler', () => {
  const regex = /<li>(?<id>\d*).\s(?<name>[^\<]*)<\/li>/gm;

  it('canHandle method should return true', () => {
    expect(RegexFileDatasetHandler.canHandle(
        new Dataset({
          file: 'myfile.txt',
          options:
          {
            regex: regex,
          },
          parseAs: 'regex',
        })))
        .toBeTruthy();
  });

  it('canHandle method should return false', () => {
    expect(RegexFileDatasetHandler.canHandle(
        new Dataset({
          file: 'myfile.txt',
        })))
        .toBeFalsy();

    expect(RegexFileDatasetHandler.canHandle(
        new Dataset({
          file: 'myfile.txt',
          options:
            {
              regex: regex,
            },
        })))
        .toBeFalsy();

    expect(RegexFileDatasetHandler.canHandle(
        new Dataset({
          file: 'myfile.txt',
          options:
              {
                regex: undefined,
              },
          parseAs: 'regex',
        })))
        .toBeFalsy();
  });

  it('getData method should return data', async () => {
    const handler = new RegexFileDatasetHandler(
        new Dataset({
          name: 'schools',
          file: './test/Assets/Datasets/schools.html',
          options:
        {
          regex: regex,
        },
        }));
    const data = await handler.load();
    expect(data).toBeDefined();
    expect(data['schools']).toBe(handler.content['schools']);
    expect(data['schools'].length).toBe(10);
  });

  it('getData method should throw', async () => {
    const handler = new RegexFileDatasetHandler(
        new Dataset({
          name: 'schools',
          file: './test/Assets/Datasets/missing_file.CSV',
          options:
        {
          regex: '//',
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

  it('getData method should return data from HTTP', async () => {
    await MockAxios.mockUrl(
        '/schools.html',
        './test/Assets/Datasets/schools.html');
    const handler = new RegexFileDatasetHandler(new Dataset({
      name: 'schools',
      url: 'schools.html',
      options:
      {
        regex: regex,
      },
    }));
    const data = await handler.load();
    expect(data).toBeDefined();
    expect(data['schools']).toBe(handler.content['schools']);
    expect(data['schools'].length).toBe(10);
  });
});
