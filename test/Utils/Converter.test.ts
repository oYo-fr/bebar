import {Converter} from '../../src/Utils/Converter';

describe('Converter', () => {
  it('should return empty arrays when providing undefined parameters', () => {
    expect(Converter.toTemplates(undefined).length).toBe(0);
    expect(Converter.toTemplates({}).length).toBe(1);
    expect(Converter.toTemplates([{}]).length).toBe(1);
    expect(Converter.toIterators('test').length).toBe(1);
    expect(Converter.toIterators(['test']).length).toBe(1);
    expect(Converter.toIterators([{variable: 'test'}]).length).toBe(1);
    expect(Converter.toIterators({variable: 'test'}).length).toBe(1);
  });
});
