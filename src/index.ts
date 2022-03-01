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
