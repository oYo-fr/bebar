import {TemplateHandler}
  from '../../../src/Handlers/Template/TemplateHandler';
import {ITemplate} from '../../../src/Models/Interfaces/ITemplate';
import {MockAxios} from '../../Utils/MockAxios';
import Handlebars from 'handlebars';
import {TemplateFactory} from '../../../src/Factories/TemplateFactory';
import {BebarHandlerContext} from '../../../src/Handlers/Bebar/BebarHandlerContext';

describe('TemplateHandler', () => {
  it('load method should not crash', async () => {
    const handler = new TemplateHandler(
        TemplateFactory.create({
          file: './test/Assets/Templates/list_of_schools.hbs',
        }), Handlebars.create());
    await handler.load(new BebarHandlerContext('.', 'do.bebar', Handlebars.create()));
  });

  it('load method should not crash loading direct content', async () => {
    const handler = new TemplateHandler(
        TemplateFactory.create({
          content: `{{#each schools}}
          {{>school school=.}}
          {{/each}}`,
        }), Handlebars.create());
    await handler.load(new BebarHandlerContext('.', 'do.bebar', Handlebars.create()));
  });

  it('load from HTTP method should not crash', async () => {
    await MockAxios.mockUrl(
        '/list_of_schools.hbs',
        './test/Assets/Templates/list_of_schools.hbs');
    const handler = new TemplateHandler(TemplateFactory.create({
      url: '/list_of_schools.hbs',
    }), Handlebars.create());
    await handler.load(new BebarHandlerContext('.', 'do.bebar', Handlebars.create()));
  });

  it('load method with data should not crash', async () => {
    const itemplate: ITemplate = {
      content: `{{#each schools as |school|}}
      {{school.id}}. {{school.name}}
      {{/each}}`,
      data: [
        {
          name: 'schools',
          file: './test/Assets/Datasets/schools.yaml',
        },
      ],
    };
    const handler = new TemplateHandler(
        TemplateFactory.create(itemplate), Handlebars.create());
    await handler.load(new BebarHandlerContext('.', 'do.bebar', Handlebars.create()));
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

  it('should produce multiple outputs', async () => {
    const handler = new TemplateHandler(
        TemplateFactory.create({
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
        }), Handlebars.create());
    await handler.load(new BebarHandlerContext('.', 'do.bebar', Handlebars.create()));
    expect(handler.outputs.length).toBe(8);
    expect(handler.outputs[0].file).toBe('Queen/Freddie Mercury.txt');
    expect(handler.outputs[0].content).toBe('Freddie Mercury (Queen) - https://www.wikiwand.com/en/Freddie_Mercury');
    expect(handler.outputs[0].keyToDataset['bands']).toBeDefined();
  });

  it('should produce multiple outputs (named iteravion value)', async () => {
    const handler = new TemplateHandler(
        TemplateFactory.create({
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
        }), Handlebars.create());
    await handler.load(new BebarHandlerContext('.', 'do.bebar', Handlebars.create()));
    expect(handler.outputs.length).toBe(8);
    expect(handler.outputs[0].file).toBe('Queen/Freddie Mercury.txt');
    expect(handler.outputs[0].content).toBe('Freddie Mercury (Queen) - https://www.wikiwand.com/en/Freddie_Mercury');
  });

  it('should produce multiple outputs (with nested arrays)', async () => {
    const handler = new TemplateHandler(
        TemplateFactory.create({
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
        }), Handlebars.create());
    await handler.load(new BebarHandlerContext('.', 'do.bebar', Handlebars.create()));
    expect(handler.outputs.length).toBe(4);
    expect(handler.outputs[0].file).toBe('Border terrier.txt');
    expect(handler.outputs[0].content).toBe('Border terrier');
  });

  it('should produce a prettified output', async () => {
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
        TemplateFactory.create(templateData), Handlebars.create());
    const handlerWithPrettify = new TemplateHandler(
        TemplateFactory.create({
          ...templateData,
          prettify: {
            parser: 'markdown',
          },
        }), Handlebars.create());
    await handlerWithoutPrettify.load(new BebarHandlerContext('.', 'do.bebar', Handlebars.create()));
    await handlerWithPrettify.load(new BebarHandlerContext('.', 'do.bebar', Handlebars.create()));
    expect(handlerWithoutPrettify.outputs[0].content !==
      handlerWithPrettify.outputs[0].content).toBeTruthy();
  });

  it('should produce an output event with broken prettifier', async () => {
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
        TemplateFactory.create({
          ...templateData,
          prettify: {
            parser: 'unknown',
          },
        }), Handlebars.create());
    await handler.load(new BebarHandlerContext('.', 'do.bebar', Handlebars.create()));
    expect(handler.outputs[0].content).toBeDefined();
  });
});
