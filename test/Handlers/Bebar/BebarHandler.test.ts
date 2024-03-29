import {BebarHandler} from '../../../src/Handlers/Bebar/BebarHandler';
import {Bebar} from '../../../src/Models/Bebar';
import {RefreshContext} from '../../../src/Refresh/RefreshContext';
import {RefreshType} from '../../../src/Refresh/RefreshType';
import path from 'path';
import fs from 'fs';
import {PathUtils} from '../../../src/Utils/PathUtils';
import {BebarHandlerContext} from '../../../src/Handlers/Bebar/BebarHandlerContext';
const YAML = require('yaml');
import Handlebars from 'handlebars';

describe('BebarHandler', () => {
  it('load method should not crash', async () => {
    const handler = new BebarHandler(new Bebar({
      data: [{file: './test/Assets/Datasets/schools.yaml'}],
      partials: [{file: './test/Assets/Partials/*.hbs'}],
      helpers: [{file: './test/Assets/Helpers/*.js'}],
      templates: [{file: './test/Assets/Templates/list_of_schools.hbs'}],
    }), new BebarHandlerContext('.', 'sample.bebar', Handlebars.create()));
    await handler.load();
    expect(handler.templateHandlers[0].outputs.length).toBeGreaterThan(0);
    expect(handler.templateHandlers[0].outputs[0].data).toBeDefined();
    expect(handler.templateHandlers[0].outputs[0].content.length).toBeGreaterThan(0);
    expect(Object.keys(handler.templateHandlers[0].outputs[0].keyToDataset).length).toBeGreaterThan(0);
  });

  it('load method should not crash with direct arrays', async () => {
    const handler = new BebarHandler(new Bebar({
      data: ['./test/Assets/Datasets/schools.yaml'],
      partials: ['./test/Assets/Partials/*.hbs'],
      helpers: ['./test/Assets/Helpers/*.js'],
      templates: [{file: './test/Assets/Templates/list_of_schools.hbs'}],
    }), new BebarHandlerContext('.', 'sample.bebar', Handlebars.create()));
    await handler.load();
    expect(handler.templateHandlers[0].outputs.length).toBeGreaterThan(0);
    expect(handler.templateHandlers[0].outputs[0].data).toBeDefined();
    expect(handler.templateHandlers[0].outputs[0].content.length).toBeGreaterThan(0);
    expect(Object.keys(handler.templateHandlers[0].outputs[0].keyToDataset).length).toBeGreaterThan(0);
  });

  it('load method should not crash with direct properties', async () => {
    const handler = new BebarHandler(new Bebar({
      data: './test/Assets/Datasets/schools.yaml',
      partials: './test/Assets/Partials/*.hbs',
      helpers: './test/Assets/Helpers/*.js',
      templates: [{file: './test/Assets/Templates/list_of_schools.hbs'}],
    }), new BebarHandlerContext('.', 'sample.bebar', Handlebars.create()));
    await handler.load();
    expect(handler.templateHandlers[0].outputs.length).toBeGreaterThan(0);
    expect(handler.templateHandlers[0].outputs[0].data).toBeDefined();
    expect(handler.templateHandlers[0].outputs[0].content.length).toBeGreaterThan(0);
    expect(Object.keys(handler.templateHandlers[0].outputs[0].keyToDataset).length).toBeGreaterThan(0);
  });

  it('load method should not crash with direct properties and one file',
      async () => {
        const handler = new BebarHandler(new Bebar({
          data: './test/Assets/Datasets/schools.yaml',
          partials: './test/Assets/Partials/school_*.hbs',
          helpers: './test/Assets/Helpers/stringHelpers.js',
          templates: [
            {file: './test/Assets/Templates/list_of_schools_html_list.hbs'}],
        }), new BebarHandlerContext('.', 'sample.bebar', Handlebars.create()));
        await handler.load();
        expect(handler.templateHandlers[0].outputs[0].data).toBeDefined();
        expect(handler.templateHandlers[0].outputs.length).toBeGreaterThan(0);
        expect(handler.templateHandlers[0].outputs[0].content.length).toBeGreaterThan(0);
        expect(handler.templateHandlers[0].outputs[0].content.includes('Harvard')).toBeTruthy();
        expect(Object.keys(handler.templateHandlers[0].outputs[0].keyToDataset).length).toBeGreaterThan(0);
      });

  it('should refresh outputs properly',
      async () => {
        const ctx = new BebarHandlerContext('.', 'do.bebar', Handlebars.create());
        const handler = new BebarHandler(new Bebar({
          data: './test/Assets/Datasets/*.yaml',
          partials: './test/Assets/Partials/*.hbs',
          helpers: './test/Assets/Helpers/*.js',
          templates: [
            {file: './test/Assets/Templates/list_of_schools.hbs', output: 'test.md'}],
        }), new BebarHandlerContext('.', 'sample.bebar', Handlebars.create()));
        await handler.load();
        for (let testcase = 0; testcase < 2; testcase++) {
          if (testcase === 1) {
            await handler.handleRefresh(new RefreshContext(RefreshType.FileContentChanged, ctx, undefined, 'sample.bebar', YAML.stringify(
                {
                  templates: [
                    {file: './test/Assets/Templates/list_of_schools.hbs', output: 'test.md',
                      data: {file: './test/Assets/Datasets/*.yaml'},
                      partials: {file: './test/Assets/Partials/*.hbs'},
                      helpers: {file: './test/Assets/Helpers/*.js'}}],
                },
            )));
          }
          expect(handler.templateHandlers[0].outputs[0].data).toBeDefined();
          expect(handler.templateHandlers[0].outputs.length).toBeGreaterThan(0);
          expect(handler.templateHandlers[0].outputs[0].content.length).toBeGreaterThan(0);
          expect(handler.templateHandlers[0].outputs[0].content.includes('Harvard')).toBeTruthy();
          expect(Object.keys(handler.templateHandlers[0].outputs[0].keyToDataset).length).toBeGreaterThan(0);
          await handler.handleRefresh(
              new RefreshContext(
                  RefreshType.FileContentChanged,
                  ctx,
                  undefined,
                  path.resolve('./test/Assets/Partials/school.hbs'),
                  '{{school.id}}. {{bold school.name}} PARTIAL UPDATED'));
          expect(handler.templateHandlers[0].outputs[0].content.includes('PARTIAL UPDATED')).toBeTruthy();
          await handler.handleRefresh(
              new RefreshContext(
                  RefreshType.FileContentChanged,
                  ctx,
                  undefined,
                  path.resolve('./test/Assets/Datasets/schools.yaml'),
                  YAML.stringify([{id: 1, name: 'Paris - La Sorbonne'}])));
          expect(handler.templateHandlers[0].outputs[0].content.includes('**Paris')).toBeTruthy();
          const newHelpersCode = `module.exports = {bold: function(text) { const Handlebars = require('handlebars');
            return new Handlebars.SafeString('__' + Handlebars.escapeExpression(text) + '__');}};`;
          const jsPath = path.resolve('./test/Assets/Helpers/stringHelpers.js');
          await handler.handleRefresh(
              new RefreshContext(
                  RefreshType.FileContentChanged, ctx, undefined, jsPath, newHelpersCode));
          expect(handler.templateHandlers[0].outputs[0].content.includes('__Paris')).toBeTruthy();
          const helpersetHandlers = testcase === 0 ? handler.helpersetHandlers[0] : handler.templateHandlers[0].helpersetHandlers[0];
          const newHelpersForFile = helpersetHandlers.helpers.filter(
              (h) => PathUtils.pathsAreEqual(h.origin, jsPath));
          expect(newHelpersForFile.length).toBe(1);
          await handler.handleRefresh(
              new RefreshContext(
                  RefreshType.FileContentChanged,
                  ctx,
                  undefined,
                  path.resolve('./test/Assets/Templates/list_of_schools.hbs'),
                  handler.templateHandlers[0].template.content + 'TEMPLATE UPDATED'));
          expect(handler.templateHandlers[0].outputs[0].content.includes('TEMPLATE UPDATED')).toBeTruthy();
          expect(Object.keys(handler.templateHandlers[0].outputs[0].keyToDataset).length).toBeGreaterThan(0);

          expect(handler.templateHandlers[0].outputs[0].data['schools']).toBeDefined();
          expect(handler.templateHandlers[0].outputs[0].data['schools_utf-16']).toBeDefined();
          await handler.handleRefresh(
              new RefreshContext(RefreshType.FileDeleted, ctx, path.resolve('./test/Assets/Datasets/schools_utf-16.yaml'), undefined, undefined));
          expect(handler.templateHandlers[0].outputs[0].data['schools_utf-16']).toBeUndefined();
          await handler.handleRefresh(
              new RefreshContext(RefreshType.FileCreated, ctx, undefined, path.resolve('./test/Assets/Datasets/schools_utf-16.yaml'), undefined));
          expect(handler.templateHandlers[0].outputs[0].data['schools_utf-16']).toBeDefined();
          expect(Object.keys(handler.templateHandlers[0].outputs[0].keyToDataset).length).toBeGreaterThan(0);

          const helpersHandler = testcase === 0 ? handler.helpersetHandlers[0] : handler.templateHandlers[0].helpersetHandlers[0];
          let helpersCount = helpersHandler.helpers.length;
          await handler.handleRefresh(
              new RefreshContext(
                  RefreshType.FileDeleted, ctx, path.resolve('./test/Assets/Helpers/vscode-colors-to-css-vars-helpers.js'), undefined, undefined));
          expect(helpersHandler.helpers.length).toBeLessThan(helpersCount);
          helpersCount = helpersHandler.helpers.length;
          await handler.handleRefresh(
              new RefreshContext(
                  RefreshType.FileCreated, ctx, undefined, path.resolve('./test/Assets/Helpers/vscode-colors-to-css-vars-helpers.js'), undefined));
          expect(helpersHandler.helpers.length).toBeGreaterThan(helpersCount);
          helpersCount = helpersHandler.helpers.length;
          await handler.handleRefresh(
              new RefreshContext(
                  RefreshType.FileMovedOrRenamed,
                  ctx,
                  path.resolve('./test/Assets/Helpers/vscode-colors-to-css-vars-helpers.js'),
                  path.resolve('./test/Assets/Helpers/none'),
                  undefined));
          expect(helpersHandler.helpers.length).toBeLessThan(helpersCount);
          await handler.handleRefresh(
              new RefreshContext(
                  RefreshType.FileMovedOrRenamed,
                  ctx,
                  path.resolve('./test/Assets/Helpers/none'),
                  path.resolve('./test/Assets/Helpers/vscode-colors-to-css-vars-helpers.js'),
                  undefined));
          await handler.handleRefresh(
              new RefreshContext(
                  RefreshType.FileMovedOrRenamed,
                  ctx,
                  path.resolve('./test/Assets/Helpers/none'),
                  path.resolve('./test/Assets/Helpers/vscode-helpers.js'),
                  undefined));

          const partialsHandler = testcase === 0 ? handler.partialsetHandlers[0] : handler.templateHandlers[0].partialsetHandlers[0];
          let partialsCount = partialsHandler.partials.length;
          await handler.handleRefresh(
              new RefreshContext(RefreshType.FileDeleted, ctx, path.resolve('./test/Assets/Partials/school_html.hbs'), undefined, undefined));
          expect(partialsHandler.partials.length).toBeLessThan(partialsCount);
          partialsCount = partialsHandler.partials.length;
          await handler.handleRefresh(
              new RefreshContext(RefreshType.FileCreated, ctx, undefined, path.resolve('./test/Assets/Partials/school_html.hbs'), undefined));
          expect(partialsHandler.partials.length).toBeGreaterThan(partialsCount);
          partialsCount = partialsHandler.partials.length;
          await handler.handleRefresh(
              new RefreshContext(
                  RefreshType.FileMovedOrRenamed,
                  ctx,
                  path.resolve('./test/Assets/Partials/school_html.hbs'),
                  path.resolve('./test/Assets/Partials/school_html.mustache'),
                  undefined));
          expect(partialsHandler.partials.length).toBeLessThan(partialsCount);
          await handler.handleRefresh(
              new RefreshContext(
                  RefreshType.FileMovedOrRenamed,
                  ctx,
                  path.resolve('./test/Assets/Partials/school_html.mustache'),
                  path.resolve('./test/Assets/Partials/school_html.hbs'),
                  undefined));
          fs.renameSync(path.resolve('./test/Assets/Partials/school_html.hbs'), path.resolve('./test/Assets/Partials/school_html2.hbs'));
          await handler.handleRefresh(
              new RefreshContext(
                  RefreshType.FileMovedOrRenamed,
                  ctx,
                  path.resolve('./test/Assets/Partials/school_html.hbs'),
                  path.resolve('./test/Assets/Partials/school_html2.hbs'),
                  undefined));
          fs.renameSync(path.resolve('./test/Assets/Partials/school_html2.hbs'), path.resolve('./test/Assets/Partials/school_html.hbs'));
          expect(partialsHandler.partials[1].name).toBe('school_html2');
        }
      });
});
