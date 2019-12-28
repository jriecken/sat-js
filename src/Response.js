'use strict'

import Vector from './Vector';

/**
 * ## Response
 * 
 * An object representing the result of an intersection. Contains:
 * - The two objects participating in the intersection
 * - The vector representing the minimum change necessary to extract the first object from the second one (as well as a unit vector in that direction and the magnitude of the overlap)
 * - Whether the first object is entirely inside the second, and vice versa.
 */
export default class Response {
  constructor() {
    this.a = null;
    this.b = null;

    this.overlapN = new Vector();
    this.overlapV = new Vector();

    this.clear();
  }

  /**
   * Set some values of the response back to their defaults.
   * 
   * Call this between tests if you are going to reuse a single Response object for multiple intersection tests (recommended as it will avoid allcating extra memory)
   * 
   * @returns {Response} Returns this for chaining.
   */
  clear() {
    this.aInB = true;
    this.bInA = true;

    this.overlap = Number.MAX_VALUE;

    return this;
  }

  
}