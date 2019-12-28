'use strict'

import Box from './Box';
import Vector from './Vector';
import Circle from './Circle';
import Polygon from './Polygon';
import Response from './Response';

/**
 * ## Object Pools
 */

/**
 * A pool of `Vector objects that are used in calculations to avoid allocating memory.
 * 
 * @type {Array<Vector>}
 */
const T_VECTORS = [];
for (let i = 0; i < 10; i++) T_VECTORS.push(new Vector());

/**
 * A pool of arrays of numbers used in calculations to avoid allocating memory.
 * 
 * @type {Array<Array<number>>}
 */
const T_ARRAYS = [];
for (let i = 0; i < 5; i++) T_ARRAYS.push([]);

/**
 * Temporary response used for Polygon hit detection.
 * 
 * @type {Response}
 */
const T_RESPONSE = new Response();

/**
 * Tiny "point" Polygon used for Polygon hit detection.
 * 
 * @type {Polygon}
 */
const TEST_POINT = new Box(new Vector(), 0.000001, 0.000001).toPolygon();

/**
 * ## Constants for Voronoi regions.
 */
const LEFT_VORONOI_REGION = -1;
const MIDDLE_VORONOI_REGION = 0;
const RIGHT_VORONOI_REGION = 1;

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
  let min = Number.MAX_VALUE;
  let max = -Number.MAX_VALUE;

  const len = points.length;

  for (let i = 0; i < len; i++) {
    // The magnitude of the projection of the point onto the normal.
    const dot = points[i].dot(normal);

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
  const len2 = line.len2();
  const dp = point.dot(line);

  // If the point is beyond the start of the line, it is in the left voronoi region.
  if (dp < 0) return LEFT_VORONOI_REGION;

  // If the point is beyond the end of the line, it is in the right voronoi region.
  else if (dp > len2) return RIGHT_VORONOI_REGION;

  // Otherwise, it's in the middle one.
  else return MIDDLE_VORONOI_REGION;
}

export default {
  Box,
  Vector,
  Circle,
  Polygon,
  Response,
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
  isSeparatingAxis(aPos, bPos, aPoints, bPoints, axis, response) {
    const rangeA = T_ARRAYS.pop();
    const rangeB = T_ARRAYS.pop();
  
    // The magnitude of the offset between the two polygons
    const offsetV = T_VECTORS.pop().copy(bPos).sub(aPos);
    const projectedOffset = offsetV.dot(axis);
  
    // Project the polygons onto the axis.
    flattenPointsOn(aPoints, axis, rangeA);
    flattenPointsOn(bPoints, axis, rangeB);
  
    // Move B's range to its position relative to A.
    rangeB[0] += projectedOffset;
    rangeB[1] += projectedOffset;
  
    // Check if there is a gap. If there is, this is a separating axis and we can stop
    if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
      T_VECTORS.push(offsetV);
  
      T_ARRAYS.push(rangeA);
      T_ARRAYS.push(rangeB);
  
      return true;
    }
  
    // This is not a separating axis. If we're calculating a response, calculate the overlap.
    if (response) {
      let overlap = 0;
  
      // A starts further left than B
      if (rangeA[0] < rangeB[0]) {
        response['aInB'] = false;
  
        // A ends before B does. We have to pull A out of B
        if (rangeA[1] < rangeB[1]) {
          overlap = rangeA[1] - rangeB[0];
  
          response['bInA'] = false;
          // B is fully inside A.  Pick the shortest way out.
        } else {
          const option1 = rangeA[1] - rangeB[0];
          const option2 = rangeB[1] - rangeA[0];
  
          overlap = option1 < option2 ? option1 : -option2;
        }
        // B starts further left than A
      } else {
        response['bInA'] = false;
  
        // B ends before A ends. We have to push A out of B
        if (rangeA[1] > rangeB[1]) {
          overlap = rangeA[0] - rangeB[1];
  
          response['aInB'] = false;
          // A is fully inside B.  Pick the shortest way out.
        } else {
          const option1 = rangeA[1] - rangeB[0];
          const option2 = rangeB[1] - rangeA[0];
  
          overlap = option1 < option2 ? option1 : -option2;
        }
      }
  
      // If this is the smallest amount of overlap we've seen so far, set it as the minimum overlap.
      const absOverlap = Math.abs(overlap);
  
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
  pointInCircle(p, c) {
    const differenceV = T_VECTORS.pop().copy(p).sub(c['pos']).sub(c['offset']);

    const radiusSq = c['r'] * c['r'];
    const distanceSq = differenceV.len2();

    T_VECTORS.push(differenceV);

    // If the distance between is smaller than the radius then the point is inside the circle.
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
  pointInPolygon(p, poly) {
    TEST_POINT['pos'].copy(p);
    T_RESPONSE.clear();

    let result = this.testPolygonPolygon(TEST_POINT, poly, T_RESPONSE);

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
  testCircleCircle(a, b, response) {
    // Check if the distance between the centers of the two circles is greater than their combined radius.
    const differenceV = T_VECTORS.pop().copy(b['pos']).add(b['offset']).sub(a['pos']).sub(a['offset']);

    const totalRadius = a['r'] + b['r'];
    const totalRadiusSq = totalRadius * totalRadius;
    const distanceSq = differenceV.len2();

    // If the distance is bigger than the combined radius, they don't intersect.
    if (distanceSq > totalRadiusSq) {
      T_VECTORS.push(differenceV);

      return false;
    }

    // They intersect.  If we're calculating a response, calculate the overlap.
    if (response) {
      const dist = Math.sqrt(distanceSq);

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
  testPolygonCircle(polygon, circle, response) {
    // Get the position of the circle relative to the polygon.
    const circlePos = T_VECTORS.pop().copy(circle.pos).add(circle.offset).sub(polygon.pos);

    const radius = circle.r;
    const radius2 = radius * radius;

    const points = polygon.calcPoints;
    const len = points.length;

    const edge = T_VECTORS.pop();
    const point = T_VECTORS.pop();

    // For each edge in the polygon:
    for (var i = 0; i < len; i++) {
      const next = i === len - 1 ? 0 : i + 1;
      const prev = i === 0 ? len - 1 : i - 1;

      let overlap = 0;
      let overlapN = null;

      // Get the edge.
      edge.copy(polygon.edges[i]);

      // Calculate the center of the circle relative to the starting point of the edge.
      point.copy(circlePos).sub(points[i]);

      // If the distance between the center of the circle and the point is bigger than the radius, the polygon is definitely not fully in the circle.
      if (response && point.len2() > radius2) response.aInB = false;

      // Calculate which Voronoi region the center of the circle is in.
      let region = voronoiRegion(edge, point);

      // If it's the left region:
      if (region === LEFT_VORONOI_REGION) {
        // We need to make sure we're in the RIGHT_VORONOI_REGION of the previous edge.
        edge.copy(polygon.edges[prev]);

        // Calculate the center of the circle relative the starting point of the previous edge
        const point2 = T_VECTORS.pop().copy(circlePos).sub(points[prev]);

        region = voronoiRegion(edge, point2);

        if (region === RIGHT_VORONOI_REGION) {
          // It's in the region we want.  Check if the circle intersects the point.
          const dist = point.len();

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

        T_VECTORS.push(point2);

        // If it's the right region:
      } else if (region === RIGHT_VORONOI_REGION) {
        // We need to make sure we're in the left region on the next edge
        edge.copy(polygon.edges[next]);

        // Calculate the center of the circle relative to the starting point of the next edge.
        point.copy(circlePos).sub(points[next]);

        region = voronoiRegion(edge, point);

        if (region === LEFT_VORONOI_REGION) {
          // It's in the region we want.  Check if the circle intersects the point.
          const dist = point.len();

          if (dist > radius) {
            // No intersection
            T_VECTORS.push(circlePos);
            T_VECTORS.push(edge);
            T_VECTORS.push(point);

            return false;
          } else if (response) {
            // It intersects, calculate the overlap.
            response.bInA = false;

            overlapN = point.normalize();
            overlap = radius - dist;
          }
        }
        // Otherwise, it's the middle region:
      } else {
        // Need to check if the circle is intersecting the edge, change the edge into its "edge normal".
        const normal = edge.perp().normalize();

        // Find the perpendicular distance between the center of the circle and the edge.
        const dist = point.dot(normal);
        const distAbs = Math.abs(dist);

        // If the circle is on the outside of the edge, there is no intersection.
        if (dist > 0 && distAbs > radius) {
          // No intersection
          T_VECTORS.push(circlePos);
          T_VECTORS.push(normal);
          T_VECTORS.push(point);

          return false;
        } else if (response) {
          // It intersects, calculate the overlap.
          overlapN = normal;
          overlap = radius - dist;

          // If the center of the circle is on the outside of the edge, or part of the circle is on the outside, the circle is not fully inside the polygon.
          if (dist >= 0 || overlap < 2 * radius) response.bInA = false;
        }
      }

      // If this is the smallest overlap we've seen, keep it.
      // (overlapN may be null if the circle was in the wrong Voronoi region).
      if (overlapN && response && Math.abs(overlap) < Math.abs(response.overlap)) {
        response.overlap = overlap;
        response.overlapN.copy(overlapN);
      }
    }

    // Calculate the final overlap vector - based on the smallest overlap.
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
  testCirclePolygon(circle, polygon, response) {
    // Test the polygon against the circle.
    const result = testPolygonCircle(polygon, circle, response);

    if (result && response) {
      // Swap A and B in the response.
      const a = response.a;
      const aInB = response.aInB;

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
  testPolygonPolygon(a, b, response) {
    const aPoints = a.calcPoints;
    const aLen = aPoints.length;

    const bPoints = b.calcPoints;
    const bLen = bPoints.length;

    // If any of the edge normals of A is a separating axis, no intersection.
    for (let i = 0; i < aLen; i++) {
      if (this.isSeparatingAxis(a.pos, b.pos, aPoints, bPoints, a.normals[i], response)) {
        return false;
      }
    }

    // If any of the edge normals of B is a separating axis, no intersection.
    for (let i = 0; i < bLen; i++) {
      if (this.isSeparatingAxis(a.pos, b.pos, aPoints, bPoints, b.normals[i], response)) {
        return false;
      }
    }

    // Since none of the edge normals of A or B are a separating axis, there is an intersection
    // and we've already calculated the smallest overlap (in isSeparatingAxis). 
    // Calculate the final overlap vector.
    if (response) {
      response['a'] = a;
      response['b'] = b;

      response['overlapV'].copy(response['overlapN']).scale(response['overlap']);
    }

    return true;
  }
}