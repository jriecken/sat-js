var SAT = require('..');
var assert = require('assert');

describe("collision of", function(){
  it("two circles", function(){
    var V = SAT.Vector;
    var C = SAT.Circle;

    var circle1 = new C(new V(0,0), 20);
    var circle2 = new C(new V(30,0), 20);
    var response = new SAT.Response();
    var collided = SAT.testCircleCircle(circle1, circle2, response);

    assert( collided );
    assert( response.overlap == 10 );
    assert( response.overlapV.x == 10 && response.overlapV.y === 0);
  });

  it("circle and polygon", function(){

    var V = SAT.Vector;
    var C = SAT.Circle;
    var P = SAT.Polygon;

    var circle = new C(new V(50,50), 20);
    // A square
    var polygon = new P(new V(0,0), [
    new V(0,0), new V(40,0), new V(40,40), new V(0,40)
    ]);
    var response = new SAT.Response();
    var collided = SAT.testPolygonCircle(polygon, circle, response);

    assert(collided);
    assert(response.overlap.toFixed(2) == "5.86");
    assert(
      response.overlapV.x.toFixed(2) == "4.14" &&
      response.overlapV.y.toFixed(2) == "4.14"
    );
  });

  it("polygon and polygon", function(){
    var V = SAT.Vector;
    var P = SAT.Polygon;

    // A square
    var polygon1 = new P(new V(0,0), [
    new V(0,0), new V(40,0), new V(40,40), new V(0,40)
    ]);
    // A triangle
    var polygon2 = new P(new V(30,0), [
    new V(0,0), new V(30, 0), new V(0, 30)
    ]);
    var response = new SAT.Response();
    var collided = SAT.testPolygonPolygon(polygon1, polygon2, response);

    assert( collided );
    assert( response.overlap == 10 );
    assert( response.overlapV.x == 10 && response.overlapV.y === 0);
  });
});

describe("No collision between", function(){
  it("two boxes", function(){
    var V = SAT.Vector;
    var B = SAT.Box;

    var box1 = new B(new V(0,0), 20, 20).toPolygon();
    var box2 = new B(new V(100,100), 20, 20).toPolygon();
    var collided = SAT.testPolygonPolygon(box1, box2);
  });
});

describe("Hit testing", function(){
  it("a circle", function(){
    var V = SAT.Vector;
    var C = SAT.Circle;

    var circle = new C(new V(100,100), 20);

    assert(!SAT.pointInCircle(new V(0,0), circle)); // false
    assert(SAT.pointInCircle(new V(110,110), circle)); // true
  });
  it("a polygon", function(){
    var V = SAT.Vector;
    var C = SAT.Circle;
    var P = SAT.Polygon;

    var triangle = new P(new V(30,0), [
    new V(0,0), new V(30, 0), new V(0, 30)
    ]);
    assert(!SAT.pointInPolygon(new V(0,0), triangle)); // false
    assert(SAT.pointInPolygon(new V(35, 5), triangle)); // true
  });
  it("a small polygon", function () {
    var V = SAT.Vector;
    var C = SAT.Circle;
    var P = SAT.Polygon;

    var v1 = new V(1, 1.1);
    var p1 = new P(new V(0,0),[new V(2,1), new V(2,2), new V(1,3), new V(0,2),new V(0,1),new V(1,0)]);
    assert(SAT.pointInPolygon(v1, p1));
  });
});
describe("Hit testing", function(){
  it("a circle", function(){
    var V = SAT.Vector;
    var C = SAT.Circle;

    var circle = new C(new V(100,100), 20);

    assert(!SAT.pointInCircle(new V(0,0), circle)); // false
    assert(SAT.pointInCircle(new V(110,110), circle)); // true
  });
  it("a polygon", function(){
    var V = SAT.Vector;
    var C = SAT.Circle;
    var P = SAT.Polygon;

    var triangle = new P(new V(30,0), [
    new V(0,0), new V(30, 0), new V(0, 30)
    ]);
    assert(!SAT.pointInPolygon(new V(0,0), triangle)); // false
    assert(SAT.pointInPolygon(new V(35, 5), triangle)); // true
  });
  it("a small polygon", function () {
    var V = SAT.Vector;
    var C = SAT.Circle;
    var P = SAT.Polygon;

    var v1 = new V(1, 1.1);
    var p1 = new P(new V(0,0),[new V(2,1), new V(2,2), new V(1,3), new V(0,2),new V(0,1),new V(1,0)]);
    assert(SAT.pointInPolygon(v1, p1));
  });
});

describe("Polygon === Box -> Polygon", function () {
  it("Polygon ouput and box polygon outout must be same", function() {
    var V = SAT.Vector;
    var P = SAT.Polygon;
    var B = SAT.Box;

    var input = new P(new V(1,1), [
      new V(1,1),
      new V(2,1),
      new V(2,2),
      new V(1,2)
    ]);
    var box = new B(new V(1,1), 1, 1); // (pos, w, h)
    var output = box.toPolygon();
    assert.deepEqual(input, output);
  })

});