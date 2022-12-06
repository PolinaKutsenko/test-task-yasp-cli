#!/usr/bin/env node

import { program } from 'commander';
import makeScreenshot from '../src/index.js';

program
  .version('0.0.1', '-V, --version', 'output the version number')
  .description('Make screenshot and save .png and .txt file of screenshot in /screenshots.')
  .action(() => {
    makeScreenshot();
    console.log('File written successfully!');
  });

program.parse();
