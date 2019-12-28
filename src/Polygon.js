'use strict'

import Vector from './Vector';

/**
 * ## Polygon
 * 
 * Represents a *convex* polygon with any number of points (specified in counter-clockwise order).
 * 
 * Note: Do _not_ manually change the `points`, `angle`, or `offset` properties. Use the provided 
 * setters. Otherwise the calculated properties will not be updated correctly.
 * 
 * `pos` can be changed directly.
 */
export default class Polygon {
  /**
   * Create a new polygon, passing in a position vector, and an array of points (represented by vectors 
   * relative to the position vector). If no position is passed in, the position of the polygon will be `(0,0)`.
   * 
   * @param {Vector} [pos=Vector] A vector representing the origin of the polygon (all other points are relative to this one)
   * @param {Array<Vector>} [points=[]] An array of vectors representing the points in the polygon, in counter-clockwise order.
   */
  constructor(pos = new Vector(), points = []) {
    this.pos = pos;
    this.angle = 0;
    this.offset = new Vector();

    this.setPoints(points);
  }

  /**
   * Set the points of the polygon. Any consecutive duplicate points will be combined.
   * 
   * Note: The points are counter-clockwise *with respect to the coordinate system*. If you directly draw the points on a screen 
   * that has the origin at the top-left corner it will _appear_ visually that the points are being specified clockwise. This is 
   * just because of the inversion of the Y-axis when being displayed.
   * 
   * @param {Array<Vector>} points An array of vectors representing the points in the polygon, in counter-clockwise order.
   * 
   * @returns {Polygon} Returns this for chaining.
   */
  setPoints(points) {
    // Only re-allocate if this is a new polygon or the number of points has changed.
    const lengthChanged = !this.points || this.points.length !== points.length;

    if (lengthChanged) {
      let i;

      const calcPoints = this.calcPoints = [];
      const edges = this.edges = [];
      const normals = this.normals = [];

      // Allocate the vector arrays for the calculated properties
      for (i = 0; i < points.length; i++) {
        // Remove consecutive duplicate points
        const p1 = points[i];
        const p2 = i < points.length - 1 ? points[i + 1] : points[0];

        if (p1 !== p2 && p1.x === p2.x && p1.y === p2.y) {
          points.splice(i, 1);
          i -= 1;
          continue;
        }

        calcPoints.push(new Vector());
        edges.push(new Vector());
        normals.push(new Vector());
      }
    }

    this.points = points;

    this._recalc();

    return this;
  }

  /**
   * Set the current rotation angle of the polygon.
   * 
   * @param {number} angle The current rotation angle (in radians).
   * 
   * @returns {Polygon} Returns this for chaining.
   */
  setAngle(angle) {
    this.angle = angle;

    this._recalc();

    return this;
  }

  /**
   * Set the current offset to apply to the `points` before applying the `angle` rotation.
   * 
   * @param {Vector} offset The new offset Vector.
   * 
   * @returns {Polygon} Returns this for chaining.
   */
  setOffset(offset) {
    this.offset = offset;

    this._recalc();

    return this;
  }

  /**
   * Rotates this Polygon counter-clockwise around the origin of *its local coordinate system* (i.e. `pos`).
   * 
   * Note: This changes the **original** points (so any `angle` will be applied on top of this rotation).
   * 
   * @param {number} angle The angle to rotate (in radians).
   * 
   * @returns {Polygon} Returns this for chaining.
   */
  rotate(angle) {
    const points = this.points;
    const len = points.length;

    for (let i = 0; i < len; i++) points[i].rotate(angle);

    this._recalc();

    return this;
  }

  /**
   * Translates the points of this polygon by a specified amount relative to the origin of *its own coordinate system* (i.e. `pos`).
   * 
   * Note: This changes the **original** points (so any `offset` will be applied on top of this translation)
   * 
   * @param {number} x The horizontal amount to translate.
   * @param {number} y The vertical amount to translate.
   * 
   * @returns {Polygon} Returns this for chaining.
   */
  translate(x, y) {
    const points = this.points;
    const len = points.length;

    for (let i = 0; i < len; i++) {
      points[i].x += x;
      points[i].y += y;
    }

    this._recalc();

    return this;
  }

  /**
   * Computes the calculated collision Polygon.
   * 
   * This applies the `angle` and `offset` to the original points then recalculates the edges and normals of the collision Polygon.
   * 
   * @private
   * 
   * @returns {Polygon} Returns this for chaining.
   */
  _recalc() {
    // Calculated points - this is what is used for underlying collisions and takes into account
    // the angle/offset set on the polygon.
    const calcPoints = this.calcPoints;

    // The edges here are the direction of the `n`th edge of the polygon, relative to
    // the `n`th point. If you want to draw a given edge from the edge value, you must
    // first translate to the position of the starting point.
    const edges = this.edges;

    // The normals here are the direction of the normal for the `n`th edge of the polygon, relative
    // to the position of the `n`th point. If you want to draw an edge normal, you must first
    // translate to the position of the starting point.
    const normals = this.normals;

    // Copy the original points array and apply the offset/angle
    const points = this.points;
    const offset = this.offset;
    const angle = this.angle;

    const len = points.length;
    let i;

    for (i = 0; i < len; i++) {
      const calcPoint = calcPoints[i].copy(points[i]);

      calcPoint.x += offset.x;
      calcPoint.y += offset.y;

      if (angle !== 0) calcPoint.rotate(angle);
    }

    // Calculate the edges/normals
    for (i = 0; i < len; i++) {
      const p1 = calcPoints[i];
      const p2 = i < len - 1 ? calcPoints[i + 1] : calcPoints[0];

      const e = edges[i].copy(p2).sub(p1);

      normals[i].copy(e).perp().normalize();
    }

    return this;
  }

  /**
   * Compute the axis-aligned bounding box.
   * 
   * Any current state (translations/rotations) will be applied before constructing the AABB.
   * 
   * Note: Returns a _new_ `Polygon` each time you call this.
   * 
   * @returns {Polygon} Returns this for chaining.
   */
  getAABB() {
    const points = this.calcPoints;
    const len = points.length;

    const xMin = points[0].x;
    const yMin = points[0].y;

    const xMax = points[0].x;
    const yMax = points[0].y;

    for (let i = 1; i < len; i++) {
      const point = points[i];

      if (point["x"] < xMin) xMin = point["x"];
      else if (point["x"] > xMax) xMax = point["x"];

      if (point["y"] < yMin) yMin = point["y"];
      else if (point["y"] > yMax) yMax = point["y"];

    }

    return new Box(this['pos'].clone().add(new Vector(xMin, yMin)), xMax - xMin, yMax - yMin).toPolygon();
  }

  /**
   * Compute the centroid (geometric center) of the Polygon.
   * 
   * Any current state (translations/rotations) will be applied before computing the centroid.
   * 
   * See https://en.wikipedia.org/wiki/Centroid#Centroid_of_a_polygon
   * 
   * Note: Returns a _new_ `Vector` each time you call this.
   * 
   * @returns {Vector} Returns a Vector that contains the coordinates of the centroid.
   */
  getCentroid() {
    const points = this.calcPoints;
    const len = points.length;

    let cx = 0;
    let cy = 0;
    let ar = 0;

    for (var i = 0; i < len; i++) {
      const p1 = points[i];
      const p2 = i === len - 1 ? points[0] : points[i + 1]; // Loop around if last point

      const a = p1["x"] * p2["y"] - p2["x"] * p1["y"];

      cx += (p1["x"] + p2["x"]) * a;
      cy += (p1["y"] + p2["y"]) * a;
      ar += a;
    }

    ar = ar * 3; // we want 1 / 6 the area and we currently have 2*area
    cx = cx / ar;
    cy = cy / ar;
    
    return new Vector(cx, cy);
  }
}