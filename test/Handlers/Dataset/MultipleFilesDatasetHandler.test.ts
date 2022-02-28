import {MultipleFilesFileDatasetHandler}
  from '../../../src/Handlers/Dataset/MultipleFilesFileDatasetHandler';
import {Dataset} from '../../../src/Models/Dataset';

describe('MultipleFilesFileDatasetHandler', () => {
  it('canHandle method should return true', () => {
    expect(MultipleFilesFileDatasetHandler.canHandle(
        new Dataset({file: './test/Assets/Datasets/*.js'})))
        .toBeTruthy();
  });

  it('canHandle method should return false', () => {
    expect(MultipleFilesFileDatasetHandler.canHandle(
        new Dataset({file: './test/Assets/Datasets/*.json'})))
        .toBeFalsy();
  });

  it('getData method should return data',
      async () => {
        const handler = new MultipleFilesFileDatasetHandler(
            new Dataset({file: './test/Assets/Datasets/*.js'}));
        const data = await handler.load();
        expect(data).toBeDefined();
        expect(data['schools']).toBeDefined();
        expect(data['schools_promise']).toBeDefined();
      });
});
