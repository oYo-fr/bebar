import {DirectDatasetHandler}
  from '../../../src/Handlers/Dataset/DirectDatasetHandler';
import {Dataset} from '../../../src/Models/Dataset';

describe('DirectDatasetHandler', () => {
  it('canHandle method should return true', () => {
    expect(DirectDatasetHandler.canHandle(
        new Dataset({
          name: 'schools',
          content: [
            {
              id: 1,
              name: 'Harvard University',
            },
          ],
        }))).toBeTruthy();
  });

  it('canHandle method should return false', () => {
    expect(DirectDatasetHandler.canHandle(
        new Dataset({file: 'myfile.jpg'}))).toBeFalsy();

    expect(DirectDatasetHandler.canHandle(
        new Dataset({
          content: [
            {
              id: 1,
              name: 'Harvard University',
            },
          ],
        }))).toBeTruthy();

    expect(DirectDatasetHandler.canHandle(
        new Dataset({
          name: 'schools',
        }))).toBeFalsy();
  });

  it('getData method should return data', async () => {
    const data = [
      {
        id: 1,
        name: 'Harvard University',
      },
    ];
    const handler = new DirectDatasetHandler(new Dataset({
      name: 'schools',
      content: data,
    }));
    const dataFromHandler = await handler.load();
    expect(dataFromHandler).toBeDefined();
    expect(dataFromHandler['schools']).toBe(handler.content['schools']);
    expect(handler.content['schools']).toBe(data);
    expect(dataFromHandler['schools'].length).toBe(1);
  });

  it('getData method should return data (without name)', async () => {
    const data = [
      {
        id: 1,
        name: 'Harvard University',
      },
    ];
    const handler = new DirectDatasetHandler(new Dataset({
      content: data,
    }));
    const dataFromHandler = await handler.load();
    expect(dataFromHandler).toBeDefined();
    expect(dataFromHandler).toBe(handler.content);
    expect(handler.content).toBe(data);
    expect(dataFromHandler.length).toBe(1);
  });
});
