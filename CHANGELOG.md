# Changelog

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

Initial release