import {MockAxios} from '../Utils/MockAxios';
import {YamlFileDatasetHandler} from '../../src/Handlers/Dataset/YamlFileDatasetHandler';
import {Dataset} from '../../src/Models/Dataset';

describe('DatasetCache', () => {
  it('getData should return data from cache', async () => {
    await MockAxios.mockUrl(
        '/schools_cache.yaml',
        './test/Assets/Datasets/schools.yaml');
    const handler = new YamlFileDatasetHandler(
        new Dataset({
          name: 'schools',
          parseAs: 'yaml',
          url: '/schools_cache.yaml',
          cache: {
            ttl: '2s',
            enabled: true,
          },
        }),
    );
    let data = await handler.load('.');
    expect(data).toBeDefined();
    expect(data['schools']).toBe(handler.content['schools']);
    expect(data['schools'].length).toBe(10);

    MockAxios.reset();
    await MockAxios.mockUrl(
        '/schools_cache.yaml',
        './test/Assets/Datasets/school_single.yaml');
    data = await handler.load('.');
    expect(data).toBeDefined();
    expect(data['schools']).toBe(handler.content['schools']);
    expect(data['schools'].length).toBe(10); // Data should be in file cache, so loading should not crash and still return 10 (not 1)

    await new Promise((f) => setTimeout(f, 3000)); // Sleep 4s for the cache to expire
    data = await handler.load('.');
    expect(data).toBeDefined();
    expect(data['schools']).toBe(handler.content['schools']);
    expect(data['schools'].length).toBe(1);
  });
});
