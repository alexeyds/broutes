#!/usr/bin/env node

process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

process.on('unhandledRejection', err => {
  throw err;
});

require('@babel/register');
require('jutest').autoRun();
