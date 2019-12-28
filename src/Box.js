'use strict'

import Vector from './Vector';
import Polygon from './Polygon';

/**
 * ## Box
 * 
 * Represents an axis-aligned box, with a width and height.
 */
export default class Box {
  /**
   * Creates a new Box, with the specified position, width, and height.
   * 
   * If no position is given, the position will be `(0, 0)`. If no width or height are given, they will
   * be set to `0`.
   * 
   * @param {Vector} [pos=new Vector()] A Vector representing the bottom-left of the box(i.e. the smallest x and smallest y value).
   * @param {number} [w=0] The width of the Box.
   * @param {number} [h=0] The height of the Box.
   */
  constructor(pos = new Vector(), w = 0, h = 0) {
    this.pos = pos;
    this.w = w;
    this.h = h;
  }

  /**
   * Returns a Polygon whose edges are the same as this Box.
   * 
   * @returns {Polygon} A new Polygon that represents this Box.
   */
  toPolygon() {
    const pos = this.pos;
    const w = this.w;
    const h = this.h;

    return new Polygon(new Vector(pos.x, pos.y), [
      new Vector(), new Vector(w, 0),
      new Vector(w, h), new Vector(0, h)
    ]);
  }
}