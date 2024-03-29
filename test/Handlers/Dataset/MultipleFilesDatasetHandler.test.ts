import {BebarHandlerContext} from '../../../src/Handlers/Bebar/BebarHandlerContext';
import {MultipleFilesFileDatasetHandler}
  from '../../../src/Handlers/Dataset/MultipleFilesFileDatasetHandler';
import {Dataset} from '../../../src/Models/Dataset';
import Handlebars from 'handlebars';

describe('MultipleFilesFileDatasetHandler', () => {
  it('canHandle method should return true', () => {
    expect(MultipleFilesFileDatasetHandler.canHandle(
        new Dataset({file: './test/Assets/Datasets/*.js'}), new BebarHandlerContext('.', 'do.bebar', Handlebars.create())))
        .toBeTruthy();
  });

  it('canHandle method should return false', () => {
    expect(MultipleFilesFileDatasetHandler.canHandle(
        new Dataset({file: './test/Assets/Datasets/*.json'}), new BebarHandlerContext('.', 'do.bebar', Handlebars.create())))
        .toBeFalsy();
  });

  it('getData method should return data',
      async () => {
        const handler = new MultipleFilesFileDatasetHandler(
            new Dataset({file: './test/Assets/Datasets/*.js'}));
        const data = await handler.load(new BebarHandlerContext('.', 'do.bebar', Handlebars.create()));
        expect(data).toBeDefined();
        expect(data['schools']).toBeDefined();
        expect(data['schools_promise']).toBeDefined();
      });
});
