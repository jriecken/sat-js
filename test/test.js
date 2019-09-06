var SAT = require('..');
var assert = require('assert');

describe('Vector.scale', function() {
  it('should scale by zero properly', function() {
    var V = SAT.Vector;
    var v1 = new V(5, 5);
    v1.scale(10, 10);
    assert(v1.x === 50);
    assert(v1.y === 50);

    v1.scale(0, 1);
    assert(v1.x === 0);
    assert(v1.y === 50);

    v1.scale(1, 0);
    assert(v1.x === 0);
    assert(v1.y === 0);
  });
});

describe("Polygon.getCentroid", function() {
  it("should calculate the correct value for a square", function() {
    var V = SAT.Vector;
    var P = SAT.Polygon;

    // A square
    var polygon = new P(new V(0,0), [
      new V(0,0), new V(40,0), new V(40,40), new V(0,40)
    ]);
    var c = polygon.getCentroid();
    assert( c.x === 20 );
    assert( c.y === 20 );
  });

  it("should calculate the correct value for a triangle", function() {
    var V = SAT.Vector;
    var P = SAT.Polygon;

    // A triangle
    var polygon = new P(new V(0,0), [
      new V(0,0), new V(100,0), new V(50,99)
    ]);
    var c = polygon.getCentroid();
    assert( c.x === 50 );
    assert( c.y === 33 );
  });
});

describe("Collision", function() {
  it("testCircleCircle", function() {
    var V = SAT.Vector;
    var C = SAT.Circle;

    var circle1 = new C(new V(0,0), 20);
    var circle2 = new C(new V(30,0), 20);
    var response = new SAT.Response();
    var collided = SAT.testCircleCircle(circle1, circle2, response);

    assert( collided );
    assert( response.overlap == 10 );
    assert( response.overlapV.x == 10 && response.overlapV.y === 0);

    circle1.offset = new V(-10, -10);
    collided = SAT.testCircleCircle(circle1, circle2, response);
    assert( !collided );
  });

  it("testPolygonCircle", function() {

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

    circle.offset = new V(10, 10);
    collided = SAT.testPolygonCircle(polygon, circle, response);
    assert(!collided);
  });

  it('testPolygonCircle - line - not collide', function () {
    var V = SAT.Vector;
    var C = SAT.Circle;
    var B = SAT.Box;

    var circle = new C(new V(50,50), 20);
    var polygon = new B(new V(1000,1000), 100, 0).toPolygon();
    var response = new SAT.Response();
    var collided = SAT.testPolygonCircle(polygon, circle, response);
    assert(!collided);
  })

  it('testPolygonCircle - line - collide', function () {
    var V = SAT.Vector;
    var C = SAT.Circle;
    var B = SAT.Box;

    var circle = new C(new V(50,50), 20);
    var polygon = new B(new V(50,50), 100, 0).toPolygon();
    var response = new SAT.Response();
    var collided = SAT.testPolygonCircle(polygon, circle, response);

    assert(collided);
    assert(response.overlap.toFixed(2) == "20.00");
  })

  it("testPolygonPolygon", function() {
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

describe("No collision", function() {
  it("testPolygonPolygon", function(){
    var V = SAT.Vector;
    var B = SAT.Box;

    var box1 = new B(new V(0,0), 20, 20).toPolygon();
    var box2 = new B(new V(100,100), 20, 20).toPolygon();
    var collided = SAT.testPolygonPolygon(box1, box2);
  });
});

describe("Point testing", function() {
  it("pointInCircle", function(){
    var V = SAT.Vector;
    var C = SAT.Circle;

    var circle = new C(new V(100,100), 20);

    assert(!SAT.pointInCircle(new V(0,0), circle)); // false
    assert(SAT.pointInCircle(new V(110,110), circle)); // true

    circle.offset = new V(-10, -10);
    assert(!SAT.pointInCircle(new V(110,110), circle)); // false
  });

  it("pointInPolygon", function() {
    var V = SAT.Vector;
    var C = SAT.Circle;
    var P = SAT.Polygon;

    var triangle = new P(new V(30,0), [
      new V(0,0), new V(30, 0), new V(0, 30)
    ]);
    assert(!SAT.pointInPolygon(new V(0,0), triangle)); // false
    assert(SAT.pointInPolygon(new V(35, 5), triangle)); // true
  });

  it("pointInPolygon (small)", function () {
    var V = SAT.Vector;
    var C = SAT.Circle;
    var P = SAT.Polygon;

    var v1 = new V(1, 1.1);
    var p1 = new P(new V(0,0),[new V(2,1), new V(2,2), new V(1,3), new V(0,2),new V(0,1),new V(1,0)]);
    assert(SAT.pointInPolygon(v1, p1));
  });
});
