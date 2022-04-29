import {BebarException} from '../../../src/Exceptions/BebarException';
import {BebarHandlerContext} from '../../../src/Handlers/Bebar/BebarHandlerContext';
import {XmlFileDatasetHandler}
  from '../../../src/Handlers/Dataset/XmlFileDatasetHandler';
import {Dataset} from '../../../src/Models/Dataset';
import {MockAxios} from '../../Utils/MockAxios';
import Handlebars from 'handlebars';

describe('XmlFileDatasetHandler', () => {
  it('canHandle method should return true', () => {
    expect(XmlFileDatasetHandler.canHandle(
        new Dataset({file: 'myfile.xml'})))
        .toBeTruthy();

    expect(XmlFileDatasetHandler.canHandle(
        new Dataset({parseAs: 'xml'})))
        .toBeTruthy();
  });

  it('canHandle method should return false', () => {
    expect(XmlFileDatasetHandler.canHandle(
        new Dataset({file: 'myfile.jpg'})))
        .toBeFalsy();

    expect(XmlFileDatasetHandler.canHandle(
        new Dataset({url: 'http://localhost/myfile.jpg'})))
        .toBeFalsy();

    expect(XmlFileDatasetHandler.canHandle(null)).toBeFalsy();
    expect(XmlFileDatasetHandler.canHandle(undefined)).toBeFalsy();
  });

  it('getData method should return data', async () => {
    const handler = new XmlFileDatasetHandler(
        new Dataset({
          name: 'schools',
          file: './test/Assets/Datasets/schools.xml',
        }));
    const data = await handler.load(new BebarHandlerContext('.', 'do.bebar', Handlebars.create()));
    expect(data).toBeDefined();
    expect(data['schools'].root.row).toBe(handler.content['schools'].root.row);
    expect(data['schools'].root.row.length).toBe(10);
  });

  it('getData method should throw', async () => {
    const handler = new XmlFileDatasetHandler(
        new Dataset({
          name: 'schools',
          file: './test/Assets/Datasets/missing_file.xml',
        }));
    try {
      await handler.load(new BebarHandlerContext('.', 'do.bebar', Handlebars.create()));
      expect(false).toBeTruthy(); // We should never reach this point
    } catch (e) {
      expect((e as BebarException).inner).toBeDefined();
      expect((e as BebarException).sender).toBe(handler);
    }
  });

  it('getData method should return data from HTTP', async () => {
    await MockAxios.mockUrl(
        '/schools.xml',
        './test/Assets/Datasets/schools.xml');
    const handler = new XmlFileDatasetHandler(new Dataset({
      name: 'schools',
      parseAs: 'xml',
      url: '/schools.xml',
    }));
    const data = await handler.load(new BebarHandlerContext('.', 'do.bebar', Handlebars.create()));
    expect(data).toBeDefined();
    expect(data['schools'].root.row).toBe(handler.content['schools'].root.row);
    expect(data['schools'].root.row.length).toBe(10);
  });
});
