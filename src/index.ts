#!/usr/bin/env node

import {App} from './App';
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import {program} from 'commander';

import pjson from './package.json';
// import fs from 'fs';
// import util from 'util';
// const readFile = util.promisify(fs.readFile);
// const pjson = JSON.parse(await readFile('./package.json', 'utf-8'));

process.stdout.write('test');
console.warn('test');
clear();
console.log(chalk.blue(figlet.textSync('bebar', {horizontalLayout: 'full'})));
console.log(pjson.version);

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
    .action(async (options: { filename: any; workdir: any }) => {
      console.log('Parsing files: ' + options.filename);
      console.log('Working directory: ' + options.workdir);
      const app = new App();
      await app.run(options.workdir, options.filename);
    })
    .parse();
