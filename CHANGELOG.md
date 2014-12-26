# Changelog

## In development

## 0.5.0 (Dec 26, 2014)

 - **(POTENTIALLY BREAKING CHANGE)** Make `recalc` on `Polygon` more memory efficient. It no longer does any allocations. The `calcPoints`,`edges` and `normals` vector arrays are reused and only created in `setPoints` when the number of new points is different than the current ones. (Fixes #15)
   - `points`, `angle` and `offset` can no longer be manually changed. The `setPoints`, `setAngle`, and `setOffset` methods **must** be used.
   - As a result of this, the `recalc` method is no longer part of the API.
 - Add `getAABB` to `Polygon` and `Circle` that calculate Axis-Aligned Bounding Boxes - thanks [TuurDutoit](https://github.com/TuurDutoit)! (Fixes #17)

## 0.4.1 (Mar 23, 2014)

 - Fix missing `T_VECTORS.push()` - thanks [shakiba](https://github.com/shakiba)! (Fixes #8)
 - Add `package.json` - released as `npm` module (Fixes #11, Fixes #12)

## 0.4 (Mar 2, 2014)

 - Add `clone` method to `Vector` that returns a new vector with the same coordinates.
 - Add `angle` and `offset` to `Polygon` that are used to modify the computed collision polygon (Fixes #3, Fixes #4)
   - The `rotate` and `translate` methods still exist on `Polygon` but they modify the original `points` of the polygon, wheras `angle` and `offset` do not modify the original points, and are instead applied as computed values.
 - Add `setPoints`, `setAngle`, and `setOffset` methods to `Polygon`

## 0.3 (Feb 11, 2014)

 - Add `pointInCircle` and `pointInPolygon` functions for performing "hit tests" (Fixes #2)

## 0.2 (Dec 8, 2013)

 - Reformat comments so that they can be run through `docco` to create an annotated source file.
 - Fix/optimize compilation with the Closure Compiler in advanced mode (previously it was mangling some important properties)
 - Wrap the code in a UMD declaration so that it works:
    - Just inserting it as a `<script>`
    - Using an AMD loader
    - In Node.js
 - Add `rotate` method to `Vector` and `Polygon`.
 - Add `translate` method to `Polygon`
 - Add some examples (using Raphael.js for display)

## 0.1

 - Initial release