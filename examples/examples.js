// Alias a few things in SAT.js to make the code shorter
var V = function (x, y) { return new SAT.Vector(x, y); };
var P = function (pos, points) { return new SAT.Polygon(pos, points); };
var C = function (pos, r) { return new SAT.Circle(pos, r); };
var B = function (pos, w, h) { return new SAT.Box(pos, w, h); };

// Converts a SAT.Polygon into a SVG path string.
function poly2path(polygon) {
  var pos = polygon.pos;
  var points = polygon.calcPoints;
  var result = 'M' + pos.x + ' ' + pos.y;
  result += 'M' + (pos.x + points[0].x) + ' ' + (pos.y + points[0].y);
  for (var i = 1; i < points.length; i++) {
    var point = points[i];
    result += 'L' + (pos.x + point.x) + ' ' + (pos.y + point.y);
  }
  result += 'Z';
  return result;
}

// Create a Raphael start drag handler for specified entity
function startDrag(entity) {
  return function () {
    this.ox = entity.data.pos.x;
    this.oy = entity.data.pos.y;
  };
}
// Create a Raphael move drag handler for specified entity
function moveDrag(entity, world) {
  return function (dx, dy) {
    // This position updating is fairly naive - it lets objects tunnel through each other, but it suffices for these examples.
    entity.data.pos.x = this.ox + dx;
    entity.data.pos.y = this.oy + dy;
    world.simulate();
  };
}
// Create a Raphael end drag handler for specified entity
function endDrag(entity) {
  return function () {
    entity.updateDisplay();
  };
}

var idCounter = 0;

function noop() {}

function Entity(data, display, options) {
  options = _.defaults(options || {}, {
    solid: false, // Whether this object is "solid" and therefore should participate in responses.
    heavy: false, // Whether this object is "heavy" and can't be moved by other objects.
    displayAttrs: {}, // Raphael attrs to set on the display object
    onCollide: noop, // Function to execute when this entity collides with another - arguments are (otherEntity, response)
    onTick: noop // Function called at the start of every simulation tick - no arguments
  });
  this.id = idCounter++;
  this.data = data;
  this.display = display;
  this.displayAttrs = _.extend({
    fill: '#CCC',
    stroke: '#000'
  }, options.displayAttrs);
  this.isSolid = options.solid;
  this.isHeavy = options.heavy;
  this.onCollide = options.onCollide;
  this.onTick = options.onTick;
}
Entity.prototype = {
  remove: function () {
    this.display.remove();
  },
  // Call this to update the display after changing the underlying data.
  updateDisplay: function () {
    if (this.data instanceof SAT.Circle) {
      this.displayAttrs.cx = this.data.pos.x;
      this.displayAttrs.cy = this.data.pos.y;
      this.displayAttrs.r = this.data.r;
    } else {
      this.displayAttrs.path = poly2path(this.data);
    }
    this.display.attr(this.displayAttrs);
  },
  tick: function () {
    this.onTick();
  },
  respondToCollision: function (other, response) {
    this.onCollide(other, response);
    // Collisions between "ghostly" objects don't matter, and
    // two "heavy" objects will just remain where they are.
    if (this.isSolid && other.isSolid &&
      !(this.isHeavy && other.isHeavy)) {
      if (this.isHeavy) {
        // Move the other object out of us
        other.data.pos.add(response.overlapV);
      } else if (other.isHeavy) {
        // Move us out of the other object
        this.data.pos.sub(response.overlapV);
      } else {
        // Move equally out of each other
        response.overlapV.scale(0.5);
        this.data.pos.sub(response.overlapV);
        other.data.pos.add(response.overlapV);
      }
    }
  }
};

function World(canvas, options) {
  options = _.defaults(options || {},  {
    loopCount: 1 // number of loops to do each time simulation is called. The higher the more accurate the simulation, but slowers.
  });
  this.canvas = canvas; // A raphael.js canvas
  this.response = new SAT.Response(); // Response reused for collisions
  this.loopCount = options.loopCount;
  this.entities = {};
}
World.prototype = {
  addEntity: function(data, options) {
    var entity = new Entity(
      data,
      data instanceof SAT.Circle ? this.canvas.circle() : this.canvas.path(),
      options
    );
    // Make the display item draggable if requested.
    if (options.draggable) {
      entity.display.drag(moveDrag(entity, this), startDrag(entity), endDrag(entity));
    }
    entity.updateDisplay();
    this.entities[entity.id] = entity;
    return entity;
  },
  removeEntity: function (entity) {
    entity.remove();
    delete this.entities[entity.id];
  },
  simulate: function () {
    var entities = _.values(this.entities);
    var entitiesLen = entities.length;
    // Let the entity do something every simulation tick
    _.each(entities, function (entity) {
      entity.tick();
    });
    // Handle collisions - loop a configurable number of times to let things "settle"
    var loopCount = this.loopCount;
    for (var i = 0; i < loopCount; i++) {
      // Naively check for collision between all pairs of entities 
      // E.g if there are 4 entities: (0, 1), (0, 2), (0, 3), (1, 2), (1, 3), (2, 3)
      for (var aCount = 0; aCount < entitiesLen; aCount++) {
        var a = entities[aCount];
        for (var bCount = aCount + 1; bCount < entitiesLen; bCount++) {
          var b = entities[bCount];
          this.response.clear();
          var collided;
          var aData = a.data;
          var bData = b.data;
          if (aData instanceof SAT.Circle) {
            if (bData instanceof SAT.Circle) {
              collided = SAT.testCircleCircle(aData, bData, this.response);
            } else {
              collided = SAT.testCirclePolygon(aData, bData, this.response);
            }
          } else {
            if (bData instanceof SAT.Circle) {
              collided = SAT.testPolygonCircle(aData, bData, this.response);
            } else {
              collided = SAT.testPolygonPolygon(aData, bData, this.response);
            }
          }
          if (collided) {
            a.respondToCollision(b, this.response);
          }
        }
      }
    }
    // Finally, update the display of each entity now that the simulation step is done.
    _.each(entities, function (entity) {
      entity.updateDisplay();
    });
  }
};