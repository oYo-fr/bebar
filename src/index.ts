#!/usr/bin/env node

import {App} from './App';
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
const program = require('commander');

// @ts-ignore
import pjson from './../package.json';
import {Settings} from './Utils/Settings';
import {LogLevel} from './Logging/LogLevel';
import {Logger} from './Logging/Logger';

program
    .storeOptionsAsProperties(false)
    // .passCommandToAction(false)
    .version(pjson.version)
    .description(
        'Command line utility to transform data using handlebar templates',
    )
    .option(
        '-f, --filename <filename>',
        'Input bebar file pattern',
        './*.bebar',
    )
    .option('-w, --workdir <workdir>', 'Working directory', '.')
    .option('-v, --verbosity <verbosity>', 'Log verbosity', 'INFO')
    .action(async (options: {
        filename: string,
        workdir: string,
        verbosity: keyof typeof LogLevel }) => {
      try {
        Settings.verbosity = LogLevel[options.verbosity];
      } catch { }
      if (Settings.verbosity) {
        clear();
        console.log(chalk.blue(
            figlet.textSync('bebar', {horizontalLayout: 'full'})));
      }
      Logger.info(undefined, `Bebar version: ${pjson.version}`);
      Logger.info(undefined, `Working directory: ${options.workdir}`);
      Logger.info(undefined, `File name pattern: ${options.filename}`);
      const app = new App();
      await app.run(options.workdir, options.filename);
    })
    .parse();

export * from './BebarController';
export * from './Events/Eventifier';
export * from './Handlers/Bebar/BebarHandler';
export * from './Handlers/Dataset/DatasetHandler';
export * from './Handlers/Helper/HelpersetHandler';
export * from './Handlers/Partialset/PartialsetHandler';
export * from './Handlers/Template/TemplateHandler';
export * from './Logging/Logger';
export * from './Logging/LogLevel';
export * from './Logging/Log';
export * from './Models/Bebar';
export * from './Models/Dataset';
export * from './Models/Helperset';
export * from './Models/Iterator';
export * from './Models/Output';
export * from './Models/Partialset';
export * from './Models/Template';
export * from './Models/Interfaces/IBebar';
export * from './Models/Interfaces/IDataset';
export * from './Models/Interfaces/IHelperset';
export * from './Models/Interfaces/IIterator';
export * from './Models/Interfaces/IOutput';
export * from './Models/Interfaces/IPartialset';
export * from './Exceptions/BebarException';
export * from './Exceptions/DatasetLoadingException';
export * from './Exceptions/HelperLoadingException';
export * from './Exceptions/HelperParsingException';
export * from './Exceptions/HelperRegisteringException';
export * from './Exceptions/OutputWritingException';
export * from './Exceptions/PartialLoadingException';
export * from './Exceptions/PartialRegisteringException';
export * from './Exceptions/TemplateExecutionException';
export * from './Exceptions/TemplateLoadingException';
export * from './Exceptions/TemplateRegisteringException';
export * from './Exceptions/UnableToHandleObjectException';
