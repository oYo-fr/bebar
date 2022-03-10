import {IDataset} from '../../src/Models/Interfaces/IDataset';
import {IPartialset} from '../../src/Models/Interfaces/IPartialset';
import {IHelperset} from '../../src/Models/Interfaces/IHelperset';
import {IIterator} from '../../src/Models/Interfaces/IIterator';
import {InterfaceConverter} from '../../src/Utils/InterfaceConverter';
import {ITemplate} from '../../src/Models/Interfaces/ITemplate';

describe('InterfaceConverter', () => {
  it('should convert many kinds of stuff to a IDataset array', () => {
    expect(InterfaceConverter.toIDatasetArray('./test/*.*').length).toBe(1);
    expect(InterfaceConverter.toIDatasetArray(['./test/*.*', './test/*.*'])
        .length).toBe(2);
    expect(InterfaceConverter.toIDatasetArray(undefined).length).toBe(0);
    const dataset: IDataset = {
      url: 'http://localhost/data.json',
    };
    expect(InterfaceConverter.toIDatasetArray(['./test/*.*', dataset])
        .length).toBe(2);
    expect(InterfaceConverter.toIDatasetArray(dataset)
        .length).toBe(1);
  });

  it('should convert many kinds of stuff to a IPartialset array', () => {
    expect(InterfaceConverter.toIPartialsetArray('./test/*.*').length).toBe(1);
    expect(InterfaceConverter.toIPartialsetArray(['./test/*.*', './test/*.*'])
        .length).toBe(2);
    expect(InterfaceConverter.toIPartialsetArray(undefined).length).toBe(0);
    const partialset: IPartialset = {
      url: 'http://localhost/Partial.json',
    };
    expect(InterfaceConverter.toIPartialsetArray(['./test/*.*', partialset])
        .length).toBe(2);
    expect(InterfaceConverter.toIPartialsetArray(partialset)
        .length).toBe(1);
  });

  it('should convert many kinds of stuff to a IHelperset array', () => {
    expect(InterfaceConverter.toIHelpersetArray('./test/*.*').length).toBe(1);
    expect(InterfaceConverter.toIHelpersetArray(['./test/*.*', './test/*.*'])
        .length).toBe(2);
    expect(InterfaceConverter.toIHelpersetArray(undefined).length).toBe(0);
    const helperset: IHelperset = {
      url: 'http://localhost/Helper.json',
    };
    expect(InterfaceConverter.toIHelpersetArray(['./test/*.*', helperset])
        .length).toBe(2);
    expect(InterfaceConverter.toIHelpersetArray(helperset)
        .length).toBe(1);
  });

  it('should convert many kinds of stuff to a IIterator array', () => {
    expect(InterfaceConverter.toIIteratorArray('./test/*.*').length).toBe(1);
    expect(InterfaceConverter.toIIteratorArray(['./test/*.*', './test/*.*'])
        .length).toBe(2);
    expect(InterfaceConverter.toIIteratorArray(undefined).length).toBe(0);
    const iterator: IIterator = {
      variable: 'http://localhost/Helper.json',
    };
    expect(InterfaceConverter.toIIteratorArray(['./test/*.*', iterator])
        .length).toBe(2);
    expect(InterfaceConverter.toIIteratorArray(iterator)
        .length).toBe(1);
  });

  it('should convert many kinds of stuff to a ITemplate array', () => {
    expect(InterfaceConverter.toITemplateArray(undefined).length).toBe(0);
    const template: ITemplate = {
      url: 'http://localhost/Helper.json',
    };
    expect(InterfaceConverter.toITemplateArray([template])
        .length).toBe(1);
    expect(InterfaceConverter.toITemplateArray(template)
        .length).toBe(1);
  });
});
