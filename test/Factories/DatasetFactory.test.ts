import {DatasetFactory} from '../../src/Factories/DatasetFactory';
import {UnableToHandleObjectException}
  from '../../src/Exceptions/UnableToHandleObjectException';
import {YamlFileDatasetHandler}
  from '../../src/Handlers/Dataset/YamlFileDatasetHandler';
import {JSFileDatasetHandler} from
  '../../src/Handlers/Dataset/JSFileDatasetHandler';
import {JSonFileDatasetHandler}
  from '../../src/Handlers/Dataset/JSonFileDatasetHandler';
import {DirectDatasetHandler}
  from '../../src/Handlers/Dataset/DirectDatasetHandler';
import {CSVFileDatasetHandler}
  from '../../src/Handlers/Dataset/CSVFileDatasetHandler';
import {Dataset} from '../../src/Models/Dataset';

describe('DatasetFactory', () => {
  it('should throw a UnableToHandleObjectException', () => {
    const factory: DatasetFactory = new DatasetFactory(new Dataset({
      name: 'sample',
      file: 'myfile.jpg',
    }));
    try {
      factory.load();
      expect(false).toBeTruthy(); // We should never reach this point
    } catch (e) {
      expect(e).toBeInstanceOf(UnableToHandleObjectException);
      expect((e as UnableToHandleObjectException).sender).toBe(factory);
    }
  });

  it('Handler should be YAML', () => {
    const factory: DatasetFactory = new DatasetFactory(new Dataset({
      name: '',
      file: './test/Assets/Datasets/schools.yaml',
    }));
    factory.load();
    expect(factory.handler).toBeInstanceOf(YamlFileDatasetHandler);
  });

  it('Handler should be JS', () => {
    const factory: DatasetFactory = new DatasetFactory(new Dataset({
      name: '',
      file: './test/Assets/Datasets/schools.js',
    }));
    factory.load();
    expect(factory.handler).toBeInstanceOf(JSFileDatasetHandler);
  });

  it('Handler should be JSON', () => {
    const factory: DatasetFactory = new DatasetFactory(new Dataset({
      name: '',
      file: './test/Assets/Datasets/schools.json',
    }));
    factory.load();
    expect(factory.handler).toBeInstanceOf(JSonFileDatasetHandler);
  });

  it('Handler should be DIRECT', () => {
    const factory: DatasetFactory = new DatasetFactory(new Dataset({
      name: 'test',
      content: { },
    }));
    factory.load();
    expect(factory.handler).toBeInstanceOf(DirectDatasetHandler);
  });

  it('Handler should be CSV', () => {
    const factory: DatasetFactory = new DatasetFactory(new Dataset({
      name: '',
      file: './test/Assets/Datasets/schools.csv',
    }));
    factory.load();
    expect(factory.handler).toBeInstanceOf(CSVFileDatasetHandler);
  });

  it('should switch handler if needed', () => {
    const dataset = new Dataset({name: 'sample', file: 'myfile.json'});
    const factory: DatasetFactory = new DatasetFactory(dataset);
    factory.load();
    expect(factory.handler).toBeInstanceOf(JSonFileDatasetHandler);
    dataset.file = 'myfile.yaml';
    expect(factory.handler).toBeInstanceOf(YamlFileDatasetHandler);
    dataset.file = 'myfile.csv';
    expect(factory.handler).toBeInstanceOf(CSVFileDatasetHandler);
    dataset.file = 'myfile.js';
    expect(factory.handler).toBeInstanceOf(JSFileDatasetHandler);
    dataset.file = 'myfile.json';
    expect(factory.handler).toBeInstanceOf(JSonFileDatasetHandler);
    dataset.content = {foo: 'bar'};
    expect(factory.handler).toBeInstanceOf(DirectDatasetHandler);
  });
});