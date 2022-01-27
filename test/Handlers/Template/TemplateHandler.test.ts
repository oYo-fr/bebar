import {TemplateHandler}
  from '../../../src/Handlers/Template/TemplateHandler';
import {ITemplate} from '../../../src/Models/Interfaces/ITemplate';
import {Template} from '../../../src/Models/Template';
import {MockAxios} from '../../Utils/MockAxios';

describe('TemplateHandler', () => {
  test('load method should not crash', async () => {
    const handler = new TemplateHandler(
        new Template({
          file: './test/Assets/Templates/list_of_schools.hbs',
        }));
    await handler.load();
  });

  test('load method should not crash loading direct content', async () => {
    const handler = new TemplateHandler(
        new Template({
          content: `{{#each schools}}
          {{>school school=.}}
          {{/each}}`,
        }));
    await handler.load();
  });

  test('load from HTTP method should not crash', async () => {
    await MockAxios.mockUrl(
        '/list_of_schools.hbs',
        './test/Assets/Templates/list_of_schools.hbs');
    const handler = new TemplateHandler(new Template({
      url: '/list_of_schools.hbs',
    }));
    await handler.load();
  });

  test('load method with data should not crash', async () => {
    const handler = new TemplateHandler(
        new Template({
          content: `{{#each schools as |school|}}
          {{school.id}}. {{school.name}}
          {{/each}}`,
          data: [
            {
              name: 'schools',
              file: './test/Assets/Datasets/schools.yaml',
            },
          ],
        }));
    await handler.load();
    expect(handler.outputs[0].content === '').toBeFalsy();
  });

  const bandsData = [
    {
      name: 'Queen',
      members: [
        {
          name: 'Freddie Mercury',
          wikipedia: 'https://www.wikiwand.com/en/Freddie_Mercury',
        },
        {
          name: 'Brian May',
          wikipedia: 'https://www.wikiwand.com/en/Brian_May',
        },
        {
          name: 'Roger Taylor',
          wikipedia: 'https://www.wikiwand.com/en/Roger_Taylor_(Queen_drummer)',
        },
        {
          name: 'John Deacon',
          wikipedia: 'https://www.wikiwand.com/en/John_Deacon',
        }],
    },
    {
      name: 'The Beatles',
      members: [
        {
          name: 'John Lennon',
          wikipedia: 'https://www.wikiwand.com/en/John_Lennon',
        },
        {
          name: 'Paul McCartney',
          wikipedia: 'https://www.wikiwand.com/en/Paul_McCartney',
        },
        {
          name: 'George Harrison',
          wikipedia: 'https://www.wikiwand.com/en/George_Harrison',
        },
        {
          name: 'Ringo Starr',
          wikipedia: 'https://www.wikiwand.com/en/Ringo_Starr',
        }],
    },
  ];

  test('should produce multiple outputs', async () => {
    const handler = new TemplateHandler(
        new Template({
          content: '{{member.name}} ({{band.name}}) - {{member.wikipedia}}',
          data: [
            {
              name: 'bands',
              content: bandsData,
            },
          ],
          output: '{{band.name}}/{{member.name}}.txt',
          iterators: [
            {
              variable: 'band',
              array: 'bands',
            },
            {
              variable: 'member',
              array: 'members',
            },
          ],
        }));
    await handler.load();
    expect(handler.outputs.length).toBe(8);
    expect(handler.outputs[0].file).toBe('Queen/Freddie Mercury.txt');
    expect(handler.outputs[0].content).toBe('Freddie Mercury (Queen) - https://www.wikiwand.com/en/Freddie_Mercury');
  });

  test('should produce multiple outputs (named iteravion value)', async () => {
    const handler = new TemplateHandler(
        new Template({
          content:
          '{{cur.member.name}} ({{cur.band.name}}) - {{cur.member.wikipedia}}',
          data: [
            {
              name: 'bands',
              content: bandsData,
            },
          ],
          output: '{{cur.band.name}}/{{cur.member.name}}.txt',
          iterators: [
            {
              variable: 'band',
              array: 'bands',
            },
            {
              variable: 'member',
              array: 'members',
            },
          ],
          iterationValueName: 'cur',
        }));
    await handler.load();
    expect(handler.outputs.length).toBe(8);
    expect(handler.outputs[0].file).toBe('Queen/Freddie Mercury.txt');
    expect(handler.outputs[0].content).toBe('Freddie Mercury (Queen) - https://www.wikiwand.com/en/Freddie_Mercury');
  });

  test('should produce multiple outputs (with nested arrays)', async () => {
    const handler = new TemplateHandler(
        new Template({
          content: '{{breed.name}}',
          data: [
            {
              name: 'animals',
              content: [
                [{'name': 'Border terrier'}, {'name': 'border collie'}],
                [{'name': 'Persan'}, {'name': 'maine coon'}],
              ],
            },
          ],
          output: '{{breed.name}}.txt',
          iterators: [
            {
              variable: 'animal',
              array: 'animals',
            },
            {
              variable: 'breed',
            },
          ],
        }));
    await handler.load();
    expect(handler.outputs.length).toBe(4);
    expect(handler.outputs[0].file).toBe('Border terrier.txt');
    expect(handler.outputs[0].content).toBe('Border terrier');
  });

  test('should produce a prettified output', async () => {
    const templateData: ITemplate = {
      file: './test/Assets/Templates/bands.hbs',
      data: [
        {
          name: 'bands',
          content: bandsData,
        },
      ],
      output: 'bands.md',
    };
    const handlerWithoutPrettify = new TemplateHandler(
        new Template(templateData));
    const handlerWithPrettify = new TemplateHandler(
        new Template({
          ...templateData,
          prettify: {
            parser: 'markdown',
          },
        }));
    await handlerWithoutPrettify.load();
    await handlerWithPrettify.load();
    expect(handlerWithoutPrettify.outputs[0].content !==
      handlerWithPrettify.outputs[0].content).toBeTruthy();
  });

  test('should produce an output event with broken prettifier', async () => {
    const templateData: ITemplate = {
      file: './test/Assets/Templates/bands.hbs',
      data: [
        {
          name: 'bands',
          content: bandsData,
        },
      ],
      output: 'bands.md',
    };
    const handler = new TemplateHandler(
        new Template({
          ...templateData,
          prettify: {
            parser: 'unknown',
          },
        }));
    await handler.load();
    expect(handler.outputs[0].content).toBeDefined();
  });
});
