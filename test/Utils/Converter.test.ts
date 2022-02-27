import {Converter} from '../../src/Utils/Converter';

describe('Converter', () => {
  test('calling converters with no data should not crash', async () => {
    expect(Converter.toBebar(undefined)).toBeUndefined();
    expect(Converter.toDataset(undefined)).toBeUndefined();
    expect(Converter.toDatasets(undefined)).toBeUndefined();
    expect(Converter.toHelperset(undefined)).toBeUndefined();
    expect(Converter.toHelpersets(undefined)).toBeUndefined();
    expect(Converter.toIterator(undefined)).toBeUndefined();
    expect(Converter.toIterators(undefined)).toBeUndefined();
    expect(Converter.toPartialset(undefined)).toBeUndefined();
    expect(Converter.toPartialsets(undefined)).toBeUndefined();
    expect(Converter.toTemplate(undefined)).toBeUndefined();
    expect(Converter.toTemplates(undefined)).toBeUndefined();
    expect(Converter.toOutput(undefined)).toBeUndefined();
    expect(Converter.toOutput({content: '', file: ''})).toBeDefined();
  });
});
