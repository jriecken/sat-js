'use strict'

import Vector from './Vector';

/**
 * ## Circle
 * 
 * Represents a circle with a position and a radius.
 * 
 * Creates a new Circle, optionally passing in a position and/or radius. If no position
 * is given, the Circle will be at `(0,0)`. If no radius is provided the circle will have
 * a radius of `0`.
 */
export default class Circle {
  /**
   * @param {Vector} pos A Vector representing the center of this Circle.
   * @param {number} r The radius of this Circle. 
   */
  constructor(pos = new Vector(), r = 0) {
    this.pos = pos;
    this.r = r;
    this.offset = new Vector();
  }

  /**
   * Compute the axis-aligned bounding box (AABB) of this Circle.
   * 
   * Note: Returns a _new_ `Polygon` each time you call this.
   * 
   * @returns {Polygon} Returns the AABB.
   */
  getAABB() {
    const r = this.r;

    const corner = this.pos.clone().add(this.offset).sub(new Vector(r, r));

    return new Box(corner, r * 2, r * 2).toPolygon();
  }

  /**
   * Set the current offset to apply to the radius.
   * 
   * @param {Vector} offset The new offset Vector.
   * 
   * @returns {Circle} Returns this for chaining.
   */
  setOffset(offset) {
    this.offset = offset;

    return this;
  }
}