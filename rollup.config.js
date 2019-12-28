'use strict'

import pkg from './package.json';
import babel from 'rollup-plugin-babel';

export default {
  /**
   * Specify the input file.
   */
  input: 'src/index.js',

  /**
   * We use babel to transpile the es6 to es5 for the greatest browser support.
   */
  plugins: [
    babel()
  ],

  /**
   * Create just a umd build that can be used on both Node and the browser.
   */
  output: [
    {
      name: 'SAT',
      file: pkg.main,
      format: 'umd'
    }
  ],
};