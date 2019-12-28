(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.SAT = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _readOnlyError(name) {
    throw new Error("\"" + name + "\" is read-only");
  }

  var Vector =
  /*#__PURE__*/
  function () {
    /**
     * @param {number} [x=0] The x coordinate of this Vector.
     * @param {number} [y=0] The y coordinate of this Vector.
     */
    function Vector() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      _classCallCheck(this, Vector);

      this.x = x;
      this.y = y;
    }
    /**
     * Copy the values of another Vector into this one.
     * 
     * @param {*} other The other Vector.
     * 
     * @returns {Vector} Returns this for chaining.
     */


    _createClass(Vector, [{
      key: "copy",
      value: function copy(other) {
        this.x = other.x;
        this.y = other.y;
        return this;
      }
      /**
       * Create a new Vector with the same coordinates as the one.
       * 
       * @returns {Vector} The new cloned Vector.
       */

    }, {
      key: "clone",
      value: function clone() {
        return new Vector(this.x, this.y);
      }
      /**
       * Change this Vector to be perpendicular to what it was before.
       * 
       * Effectively this rotates it 90 degrees in a clockwise direction.
       * 
       * @returns {Vector} Returns this for chaining.
       */

    }, {
      key: "perp",
      value: function perp() {
        var x = this.x;
        this.x = this.y;
        this.y = -x;
        return this;
      }
      /**
       * Rotate this Vector (counter-clockwise) by the specified angle (in radians).
       * 
       * @param {number} angle The angle to rotate (in radians).
       * 
       * @returns {Vector} Returns this for chaining.
       */

    }, {
      key: "rotate",
      value: function rotate(angle) {
        var x = this.x;
        var y = this.y;
        this.x = x * Math.cos(angle) - y * Math.sin(angle);
        this.y = x * Math.sin(angle) + y * Math.cos(angle);
        return this;
      }
      /**
       * Reverse this Vector.
       * 
       * @returns {Vector} Returns this for chaining.
       */

    }, {
      key: "reverse",
      value: function reverse() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
      }
      /**
       * Normalize this vector (make it have a length of `1`).
       * 
       * @returns {Vector} Returns this for chaining.
       */

    }, {
      key: "normalize",
      value: function normalize() {
        var d = this.len();

        if (d > 0) {
          this.x = this.x / d;
          this.y = this.y / d;
        }

        return this;
      }
      /**
       * Add another Vector to this one.
       * 
       * @param {Vector} other The other Vector.
       * 
       * @returns {Vector} Returns this for chaining.
       */

    }, {
      key: "add",
      value: function add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
      }
      /**
       * Subtract another Vector from this one.
       * 
       * @param {Vector} other The other Vector.
       * 
       * @returns {Vector} Returns this for chaining.
       */

    }, {
      key: "sub",
      value: function sub(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
      }
      /**
       * Scale this Vector.
       * 
       * An independent scaling factor can be provided for each axis, or a single scaling factor will scale
       * both `x` and `y`.
       * 
       * @param {number} x The scaling factor in the x direction.
       * @param {number} [y] The scaling factor in the y direction.
       * 
       * @returns {Vector} Returns this for chaining.
       */

    }, {
      key: "scale",
      value: function scale(x, y) {
        this.x *= x;
        this.y *= typeof y != 'undefined' ? y : x;
        return this;
      }
      /**
       * Project this Vector onto another Vector.
       * 
       * @param {Vector} other The Vector to project onto.
       * 
       * @returns {Vector} Returns this for chaining.
       */

    }, {
      key: "project",
      value: function project(other) {
        var amt = this.dot(other) / other.len2();
        this.x = amt * other.x;
        this.y = amt * other.y;
        return this;
      }
      /**
       * Project this Vector onto a Vector of unit length.
       * 
       * This is slightly more efficient than `project` when dealing with unit vectors.
       * 
       * @param {Vector} other The unit vector to project onto.
       * 
       * @returns {Vector} Returns this for chaining.
       */

    }, {
      key: "projectN",
      value: function projectN(other) {
        var amt = this.dot(other);
        this.x = amt * other.x;
        this.y = amt * other.y;
        return this;
      }
      /**
       * Reflect this Vector on an arbitrary axis.
       * 
       * @param {Vector} axis The Vector representing the axis.
       * 
       * @returns {Vector} Returns this for chaining.
       */

    }, {
      key: "reflect",
      value: function reflect(axis) {
        var x = this.x;
        var y = this.y;
        this.project(axis).scale(2);
        this.x -= x;
        this.y -= y;
        return this;
      }
      /**
       * Reflect this Vector on an arbitrary axis.
       * 
       * This is slightly more efficient than `reflect` when dealing with an axis that is a unit vector.
       * 
       * @param {Vector} axis The Vector representing the axis.
       * 
       * @returns {Vector} Returns this for chaining.
       */

    }, {
      key: "reflectN",
      value: function reflectN(axis) {
        var x = this.x;
        var y = this.y;
        this.projectN(axis).scale(2);
        this.x -= x;
        this.y -= y;
        return this;
      }
      /**
       * Get the dot product of this Vector and another.
       * 
       * @param {Vector} other The Vector to dot this one against.
       * 
       * @returns {Vector} Returns this for chaining.
       */

    }, {
      key: "dot",
      value: function dot(other) {
        return this.x * other.x + this.y * other.y;
      }
      /**
       * Get the squared length of this Vector.
       * 
       * @returns {Vector} Returns this for chaining.
       */

    }, {
      key: "len2",
      value: function len2() {
        return this.dot(this);
      }
      /**
       * Get the length of this Vector.
       * 
       * @returns {Vector} Returns this for chaining.
       */

    }, {
      key: "len",
      value: function len() {
        return Math.sqrt(this.len2());
      }
    }]);

    return Vector;
  }();

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

  var Polygon =
  /*#__PURE__*/
  function () {
    /**
     * Create a new polygon, passing in a position vector, and an array of points (represented by vectors 
     * relative to the position vector). If no position is passed in, the position of the polygon will be `(0,0)`.
     * 
     * @param {Vector} [pos=Vector] A vector representing the origin of the polygon (all other points are relative to this one)
     * @param {Array<Vector>} [points=[]] An array of vectors representing the points in the polygon, in counter-clockwise order.
     */
    function Polygon() {
      var pos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector();
      var points = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      _classCallCheck(this, Polygon);

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


    _createClass(Polygon, [{
      key: "setPoints",
      value: function setPoints(points) {
        // Only re-allocate if this is a new polygon or the number of points has changed.
        var lengthChanged = !this.points || this.points.length !== points.length;

        if (lengthChanged) {
          var i;
          var calcPoints = this.calcPoints = [];
          var edges = this.edges = [];
          var normals = this.normals = []; // Allocate the vector arrays for the calculated properties

          for (i = 0; i < points.length; i++) {
            // Remove consecutive duplicate points
            var p1 = points[i];
            var p2 = i < points.length - 1 ? points[i + 1] : points[0];

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

    }, {
      key: "setAngle",
      value: function setAngle(angle) {
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

    }, {
      key: "setOffset",
      value: function setOffset(offset) {
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

    }, {
      key: "rotate",
      value: function rotate(angle) {
        var points = this.points;
        var len = points.length;

        for (var i = 0; i < len; i++) {
          points[i].rotate(angle);
        }

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

    }, {
      key: "translate",
      value: function translate(x, y) {
        var points = this.points;
        var len = points.length;

        for (var i = 0; i < len; i++) {
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

    }, {
      key: "_recalc",
      value: function _recalc() {
        // Calculated points - this is what is used for underlying collisions and takes into account
        // the angle/offset set on the polygon.
        var calcPoints = this.calcPoints; // The edges here are the direction of the `n`th edge of the polygon, relative to
        // the `n`th point. If you want to draw a given edge from the edge value, you must
        // first translate to the position of the starting point.

        var edges = this.edges; // The normals here are the direction of the normal for the `n`th edge of the polygon, relative
        // to the position of the `n`th point. If you want to draw an edge normal, you must first
        // translate to the position of the starting point.

        var normals = this.normals; // Copy the original points array and apply the offset/angle

        var points = this.points;
        var offset = this.offset;
        var angle = this.angle;
        var len = points.length;
        var i;

        for (i = 0; i < len; i++) {
          var calcPoint = calcPoints[i].copy(points[i]);
          calcPoint.x += offset.x;
          calcPoint.y += offset.y;
          if (angle !== 0) calcPoint.rotate(angle);
        } // Calculate the edges/normals


        for (i = 0; i < len; i++) {
          var p1 = calcPoints[i];
          var p2 = i < len - 1 ? calcPoints[i + 1] : calcPoints[0];
          var e = edges[i].copy(p2).sub(p1);
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

    }, {
      key: "getAABB",
      value: function getAABB() {
        var points = this.calcPoints;
        var len = points.length;
        var xMin = points[0].x;
        var yMin = points[0].y;
        var xMax = points[0].x;
        var yMax = points[0].y;

        for (var i = 1; i < len; i++) {
          var point = points[i];
          if (point["x"] < xMin) xMin = (_readOnlyError("xMin"), point["x"]);else if (point["x"] > xMax) xMax = (_readOnlyError("xMax"), point["x"]);
          if (point["y"] < yMin) yMin = (_readOnlyError("yMin"), point["y"]);else if (point["y"] > yMax) yMax = (_readOnlyError("yMax"), point["y"]);
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

    }, {
      key: "getCentroid",
      value: function getCentroid() {
        var points = this.calcPoints;
        var len = points.length;
        var cx = 0;
        var cy = 0;
        var ar = 0;

        for (var i = 0; i < len; i++) {
          var p1 = points[i];
          var p2 = i === len - 1 ? points[0] : points[i + 1]; // Loop around if last point

          var a = p1["x"] * p2["y"] - p2["x"] * p1["y"];
          cx += (p1["x"] + p2["x"]) * a;
          cy += (p1["y"] + p2["y"]) * a;
          ar += a;
        }

        ar = ar * 3; // we want 1 / 6 the area and we currently have 2*area

        cx = cx / ar;
        cy = cy / ar;
        return new Vector(cx, cy);
      }
    }]);

    return Polygon;
  }();

  /**
   * ## Box
   * 
   * Represents an axis-aligned box, with a width and height.
   */

  var Box$1 =
  /*#__PURE__*/
  function () {
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
    function Box() {
      var pos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector();
      var w = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var h = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      _classCallCheck(this, Box);

      this.pos = pos;
      this.w = w;
      this.h = h;
    }
    /**
     * Returns a Polygon whose edges are the same as this Box.
     * 
     * @returns {Polygon} A new Polygon that represents this Box.
     */


    _createClass(Box, [{
      key: "toPolygon",
      value: function toPolygon() {
        var pos = this.pos;
        var w = this.w;
        var h = this.h;
        return new Polygon(new Vector(pos.x, pos.y), [new Vector(), new Vector(w, 0), new Vector(w, h), new Vector(0, h)]);
      }
    }]);

    return Box;
  }();

  /**
   * ## Circle
   * 
   * Represents a circle with a position and a radius.
   * 
   * Creates a new Circle, optionally passing in a position and/or radius. If no position
   * is given, the Circle will be at `(0,0)`. If no radius is provided the circle will have
   * a radius of `0`.
   */

  var Circle =
  /*#__PURE__*/
  function () {
    /**
     * @param {Vector} pos A Vector representing the center of this Circle.
     * @param {number} r The radius of this Circle. 
     */
    function Circle() {
      var pos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector();
      var r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      _classCallCheck(this, Circle);

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


    _createClass(Circle, [{
      key: "getAABB",
      value: function getAABB() {
        var r = this.r;
        var corner = this.pos.clone().add(this.offset).sub(new Vector(r, r));
        return new Box(corner, r * 2, r * 2).toPolygon();
      }
      /**
       * Set the current offset to apply to the radius.
       * 
       * @param {Vector} offset The new offset Vector.
       * 
       * @returns {Circle} Returns this for chaining.
       */

    }, {
      key: "setOffset",
      value: function setOffset(offset) {
        this.offset = offset;
        return this;
      }
    }]);

    return Circle;
  }();

  /**
   * ## Response
   * 
   * An object representing the result of an intersection. Contains:
   * - The two objects participating in the intersection
   * - The vector representing the minimum change necessary to extract the first object from the second one (as well as a unit vector in that direction and the magnitude of the overlap)
   * - Whether the first object is entirely inside the second, and vice versa.
   */

  var Response =
  /*#__PURE__*/
  function () {
    function Response() {
      _classCallCheck(this, Response);

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


    _createClass(Response, [{
      key: "clear",
      value: function clear() {
        this.aInB = true;
        this.bInA = true;
        this.overlap = Number.MAX_VALUE;
        return this;
      }
    }]);

    return Response;
  }();

  /**
   * ## Object Pools
   */

  /**
   * A pool of `Vector objects that are used in calculations to avoid allocating memory.
   * 
   * @type {Array<Vector>}
   */

  var T_VECTORS = [];

  for (var i = 0; i < 10; i++) {
    T_VECTORS.push(new Vector());
  }
  /**
   * A pool of arrays of numbers used in calculations to avoid allocating memory.
   * 
   * @type {Array<Array<number>>}
   */


  var T_ARRAYS = [];

  for (var _i = 0; _i < 5; _i++) {
    T_ARRAYS.push([]);
  }
  /**
   * Temporary response used for Polygon hit detection.
   * 
   * @type {Response}
   */


  var T_RESPONSE = new Response();
  /**
   * Tiny "point" Polygon used for Polygon hit detection.
   * 
   * @type {Polygon}
   */

  var TEST_POINT = new Box$1(new Vector(), 0.000001, 0.000001).toPolygon();
  /**
   * ## Constants for Voronoi regions.
   */

  var LEFT_VORONOI_REGION = -1;
  var MIDDLE_VORONOI_REGION = 0;
  var RIGHT_VORONOI_REGION = 1;
  /**
   * ## Helper Functions
   */

  /**
   * Flattens the specified array of points onto a unit vector axis resulting in a one dimensionsl
   * range of the minimum and maximum value on that axis.
   * 
   * @param {Array<Vector>} points The points to flatten.
   * @param {Vector} normal The unit vector axis to flatten on.
   * @param {Array<number>} result An array. After calling this function, result[0] will be the minimum value, result[1] will be the maximum value.
   */

  function flattenPointsOn(points, normal, result) {
    var min = Number.MAX_VALUE;
    var max = -Number.MAX_VALUE;
    var len = points.length;

    for (var _i2 = 0; _i2 < len; _i2++) {
      // The magnitude of the projection of the point onto the normal.
      var dot = points[_i2].dot(normal);

      if (dot < min) min = dot;
      if (dot > max) max = dot;
    }

    result[0] = min;
    result[1] = max;
  }
  /**
   * Calculates which Voronoi region a point is on a line segment.
   * 
   * It is assumed that both the line and the point are relative to `(0,0)`
   * 
   *             |       (0)      |
   *      (-1)  [S]--------------[E]  (1)
   *            |       (0)      |
   * 
   * @param {Vector} line The line segment.
   * @param {Vector} point The point.
   * @return {number} LEFT_VORONOI_REGION (-1) if it is the left region,
   *                  MIDDLE_VORONOI_REGION (0) if it is the middle region,
   *                  RIGHT_VORONOI_REGION (1) if it is the right region.
   */


  function voronoiRegion(line, point) {
    var len2 = line.len2();
    var dp = point.dot(line); // If the point is beyond the start of the line, it is in the left voronoi region.

    if (dp < 0) return LEFT_VORONOI_REGION; // If the point is beyond the end of the line, it is in the right voronoi region.
    else if (dp > len2) return RIGHT_VORONOI_REGION; // Otherwise, it's in the middle one.
      else return MIDDLE_VORONOI_REGION;
  }

  var index = {
    Box: Box$1,
    Vector: Vector,
    Circle: Circle,
    Polygon: Polygon,
    Response: Response,
    V: Vector,

    /**
     * Check whether two convex polygons are separated by the specified axis (must be a unit vector).
     * 
     * @param {Vector} aPos The position of the first polygon.
     * @param {Vector} bPos The position of the second polygon.
     * @param {Array<Vector>} aPoints The points in the first polygon.
     * @param {Array<Vector>} bPoints The points in the second polygon.
     * @param {Vector} axis The axis (unit sized) to test against.  The points of both polygons will be projected onto this axis.
     * @param {Response=} response A Response object (optional) which will be populated if the axis is not a separating axis.
     * @return {boolean} true if it is a separating axis, false otherwise.  If false, and a response is passed in, information about how much overlap and the direction of the overlap will be populated.
     */
    isSeparatingAxis: function isSeparatingAxis(aPos, bPos, aPoints, bPoints, axis, response) {
      var rangeA = T_ARRAYS.pop();
      var rangeB = T_ARRAYS.pop(); // The magnitude of the offset between the two polygons

      var offsetV = T_VECTORS.pop().copy(bPos).sub(aPos);
      var projectedOffset = offsetV.dot(axis); // Project the polygons onto the axis.

      flattenPointsOn(aPoints, axis, rangeA);
      flattenPointsOn(bPoints, axis, rangeB); // Move B's range to its position relative to A.

      rangeB[0] += projectedOffset;
      rangeB[1] += projectedOffset; // Check if there is a gap. If there is, this is a separating axis and we can stop

      if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
        T_VECTORS.push(offsetV);
        T_ARRAYS.push(rangeA);
        T_ARRAYS.push(rangeB);
        return true;
      } // This is not a separating axis. If we're calculating a response, calculate the overlap.


      if (response) {
        var overlap = 0; // A starts further left than B

        if (rangeA[0] < rangeB[0]) {
          response['aInB'] = false; // A ends before B does. We have to pull A out of B

          if (rangeA[1] < rangeB[1]) {
            overlap = rangeA[1] - rangeB[0];
            response['bInA'] = false; // B is fully inside A.  Pick the shortest way out.
          } else {
            var option1 = rangeA[1] - rangeB[0];
            var option2 = rangeB[1] - rangeA[0];
            overlap = option1 < option2 ? option1 : -option2;
          } // B starts further left than A

        } else {
          response['bInA'] = false; // B ends before A ends. We have to push A out of B

          if (rangeA[1] > rangeB[1]) {
            overlap = rangeA[0] - rangeB[1];
            response['aInB'] = false; // A is fully inside B.  Pick the shortest way out.
          } else {
            var _option = rangeA[1] - rangeB[0];

            var _option2 = rangeB[1] - rangeA[0];

            overlap = _option < _option2 ? _option : -_option2;
          }
        } // If this is the smallest amount of overlap we've seen so far, set it as the minimum overlap.


        var absOverlap = Math.abs(overlap);

        if (absOverlap < response['overlap']) {
          response['overlap'] = absOverlap;
          response['overlapN'].copy(axis);
          if (overlap < 0) response['overlapN'].reverse();
        }
      }

      T_VECTORS.push(offsetV);
      T_ARRAYS.push(rangeA);
      T_ARRAYS.push(rangeB);
      return false;
    },

    /**
     * ## Collision Tests
     */

    /**
     * Check if a point is inside a circle.
     * 
     * @param {Vector} p The point to test.
     * @param {Circle} c The circle to test.
     * 
     * @returns {boolean} Returns true if the point is inside the circle or false otherwise.
     */
    pointInCircle: function pointInCircle(p, c) {
      var differenceV = T_VECTORS.pop().copy(p).sub(c['pos']).sub(c['offset']);
      var radiusSq = c['r'] * c['r'];
      var distanceSq = differenceV.len2();
      T_VECTORS.push(differenceV); // If the distance between is smaller than the radius then the point is inside the circle.

      return distanceSq <= radiusSq;
    },

    /**
     * Check if a point is inside a convex polygon.
     * 
     * @param {Vector} p The point to test.
     * @param {Polygon} poly The polygon to test.
     * 
     * @returns {boolean} Returns true if the point is inside the polygon or false otherwise.
     */
    pointInPolygon: function pointInPolygon(p, poly) {
      TEST_POINT['pos'].copy(p);
      T_RESPONSE.clear();
      var result = this.testPolygonPolygon(TEST_POINT, poly, T_RESPONSE);
      if (result) result = T_RESPONSE['aInB'];
      return result;
    },

    /**
     * Check if two circles collide.
     * 
     * @param {Circle} a The first circle.
     * @param {Circle} b The second circle.
     * @param {Response} [response] An optional response object that will be populated if the circles intersect.
     * 
     * @returns {boolean} Returns true if the circles intersect or false otherwise.
     */
    testCircleCircle: function testCircleCircle(a, b, response) {
      // Check if the distance between the centers of the two circles is greater than their combined radius.
      var differenceV = T_VECTORS.pop().copy(b['pos']).add(b['offset']).sub(a['pos']).sub(a['offset']);
      var totalRadius = a['r'] + b['r'];
      var totalRadiusSq = totalRadius * totalRadius;
      var distanceSq = differenceV.len2(); // If the distance is bigger than the combined radius, they don't intersect.

      if (distanceSq > totalRadiusSq) {
        T_VECTORS.push(differenceV);
        return false;
      } // They intersect.  If we're calculating a response, calculate the overlap.


      if (response) {
        var dist = Math.sqrt(distanceSq);
        response.a = a;
        response.b = b;
        response.overlap = totalRadius - dist;
        response.overlapN.copy(differenceV.normalize());
        response.overlapV.copy(differenceV).scale(response.overlap);
        response.aInB = a.r <= b.r && dist <= b.r - a.r;
        response.bInA = b.r <= a.r && dist <= a.r - b.r;
      }

      T_VECTORS.push(differenceV);
      return true;
    },

    /**
     * Check if a polygon and a circle collide.
     * 
     * @param {Polygon} polygon The polygon.
     * @param {Circle} circle The circle.
     * @param {Response} [response] An optional response object that will be populated if they intersect.
     * 
     * @returns {boolean} Returns true if they intersect or false otherwise.
     */
    testPolygonCircle: function testPolygonCircle(polygon, circle, response) {
      // Get the position of the circle relative to the polygon.
      var circlePos = T_VECTORS.pop().copy(circle.pos).add(circle.offset).sub(polygon.pos);
      var radius = circle.r;
      var radius2 = radius * radius;
      var points = polygon.calcPoints;
      var len = points.length;
      var edge = T_VECTORS.pop();
      var point = T_VECTORS.pop(); // For each edge in the polygon:

      for (var i = 0; i < len; i++) {
        var next = i === len - 1 ? 0 : i + 1;
        var prev = i === 0 ? len - 1 : i - 1;
        var overlap = 0;
        var overlapN = null; // Get the edge.

        edge.copy(polygon.edges[i]); // Calculate the center of the circle relative to the starting point of the edge.

        point.copy(circlePos).sub(points[i]); // If the distance between the center of the circle and the point is bigger than the radius, the polygon is definitely not fully in the circle.

        if (response && point.len2() > radius2) response.aInB = false; // Calculate which Voronoi region the center of the circle is in.

        var region = voronoiRegion(edge, point); // If it's the left region:

        if (region === LEFT_VORONOI_REGION) {
          // We need to make sure we're in the RIGHT_VORONOI_REGION of the previous edge.
          edge.copy(polygon.edges[prev]); // Calculate the center of the circle relative the starting point of the previous edge

          var point2 = T_VECTORS.pop().copy(circlePos).sub(points[prev]);
          region = voronoiRegion(edge, point2);

          if (region === RIGHT_VORONOI_REGION) {
            // It's in the region we want.  Check if the circle intersects the point.
            var dist = point.len();

            if (dist > radius) {
              // No intersection
              T_VECTORS.push(circlePos);
              T_VECTORS.push(edge);
              T_VECTORS.push(point);
              T_VECTORS.push(point2);
              return false;
            } else if (response) {
              // It intersects, calculate the overlap.
              response.bInA = false;
              overlapN = point.normalize();
              overlap = radius - dist;
            }
          }

          T_VECTORS.push(point2); // If it's the right region:
        } else if (region === RIGHT_VORONOI_REGION) {
          // We need to make sure we're in the left region on the next edge
          edge.copy(polygon.edges[next]); // Calculate the center of the circle relative to the starting point of the next edge.

          point.copy(circlePos).sub(points[next]);
          region = voronoiRegion(edge, point);

          if (region === LEFT_VORONOI_REGION) {
            // It's in the region we want.  Check if the circle intersects the point.
            var _dist = point.len();

            if (_dist > radius) {
              // No intersection
              T_VECTORS.push(circlePos);
              T_VECTORS.push(edge);
              T_VECTORS.push(point);
              return false;
            } else if (response) {
              // It intersects, calculate the overlap.
              response.bInA = false;
              overlapN = point.normalize();
              overlap = radius - _dist;
            }
          } // Otherwise, it's the middle region:

        } else {
          // Need to check if the circle is intersecting the edge, change the edge into its "edge normal".
          var normal = edge.perp().normalize(); // Find the perpendicular distance between the center of the circle and the edge.

          var _dist2 = point.dot(normal);

          var distAbs = Math.abs(_dist2); // If the circle is on the outside of the edge, there is no intersection.

          if (_dist2 > 0 && distAbs > radius) {
            // No intersection
            T_VECTORS.push(circlePos);
            T_VECTORS.push(normal);
            T_VECTORS.push(point);
            return false;
          } else if (response) {
            // It intersects, calculate the overlap.
            overlapN = normal;
            overlap = radius - _dist2; // If the center of the circle is on the outside of the edge, or part of the circle is on the outside, the circle is not fully inside the polygon.

            if (_dist2 >= 0 || overlap < 2 * radius) response.bInA = false;
          }
        } // If this is the smallest overlap we've seen, keep it.
        // (overlapN may be null if the circle was in the wrong Voronoi region).


        if (overlapN && response && Math.abs(overlap) < Math.abs(response.overlap)) {
          response.overlap = overlap;
          response.overlapN.copy(overlapN);
        }
      } // Calculate the final overlap vector - based on the smallest overlap.


      if (response) {
        response.a = polygon;
        response.b = circle;
        response.overlapV.copy(response.overlapN).scale(response.overlap);
      }

      T_VECTORS.push(circlePos);
      T_VECTORS.push(edge);
      T_VECTORS.push(point);
      return true;
    },

    /**
     * Check if a circle and a polygon collide.
     * 
     * **NOTE:** This is slightly less efficient than polygonCircle as it just runs polygonCircle and reverses everything
     * at the end.
     * 
     * @param {Circle} circle The circle.
     * @param {Polygon} polygon The polygon.
     * @param {Response} [response] An optional response object that will be populated if they intersect.
     * 
     * @returns {boolean} Returns true if they intersect or false otherwise.
     */
    testCirclePolygon: function testCirclePolygon(circle, polygon, response) {
      // Test the polygon against the circle.
      var result = testPolygonCircle(polygon, circle, response);

      if (result && response) {
        // Swap A and B in the response.
        var a = response.a;
        var aInB = response.aInB;
        response.overlapN.reverse();
        response.overlapV.reverse();
        response.a = response.b;
        response.b = a;
        response.aInB = response.bInA;
        response.bInA = aInB;
      }

      return result;
    },

    /**
     * Checks whether polygons collide.
     * 
     * @param {Polygon} a The first polygon.
     * @param {Polygon} b The second polygon.
     * @param {Response} [response] An optional response object that will be populated if they intersect.
     * 
     * @returns {boolean} Returns true if they intersect or false otherwise.
     */
    testPolygonPolygon: function testPolygonPolygon(a, b, response) {
      var aPoints = a.calcPoints;
      var aLen = aPoints.length;
      var bPoints = b.calcPoints;
      var bLen = bPoints.length; // If any of the edge normals of A is a separating axis, no intersection.

      for (var _i3 = 0; _i3 < aLen; _i3++) {
        if (this.isSeparatingAxis(a.pos, b.pos, aPoints, bPoints, a.normals[_i3], response)) {
          return false;
        }
      } // If any of the edge normals of B is a separating axis, no intersection.


      for (var _i4 = 0; _i4 < bLen; _i4++) {
        if (this.isSeparatingAxis(a.pos, b.pos, aPoints, bPoints, b.normals[_i4], response)) {
          return false;
        }
      } // Since none of the edge normals of A or B are a separating axis, there is an intersection
      // and we've already calculated the smallest overlap (in isSeparatingAxis). 
      // Calculate the final overlap vector.


      if (response) {
        response['a'] = a;
        response['b'] = b;
        response['overlapV'].copy(response['overlapN']).scale(response['overlap']);
      }

      return true;
    }
  };

  return index;

})));
