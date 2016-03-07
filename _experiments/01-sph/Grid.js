define("Grid", function () {

  function Grid( width, height, h ) {
    this.width = width;
    this.h = h;
    this.cellCount = (width+2*h) / h * (height+2*h) / h;
    this.cells = new Array(Math.ceil(this.cellCount));
    this.init();
  }



  Grid.prototype.init = function() {
    for (var k=0; k<this.cellCount; ++k) {
      this.cells[k] = new Array();
    }
  }

  

  Grid.prototype.calculate = function(particles) {
    for (var k=0; k<this.cellCount; ++k) {
      this.cells[k].length = 0;
    }

    var id;
    for (var k=particles.length-1; k>=0; --k) {
      id = idx(particles[k].x, particles[k].y, this.width, this.h);
      if(id>=0 && id<this.cellCount) {
        this.cells[id].push(particles[k]);
      }
    }

    for (var k=particles.length-1; k>=0; --k) {
      this.findNeighbors(particles[k]);
    }
  }



  Grid.prototype.findNeighbors = function(queryParticle) {
    queryParticle.neighborCount = 0;

    var k, id, ix, iy;
    var h2 = this.h * this.h;
    for (ix=-this.h; ix<=this.h; ix+=this.h) {
      for (iy=-this.h; iy<=this.h; iy+=this.h) {
        id = idx(queryParticle.x + ix, queryParticle.y + iy, this.width, this.h);
        if(id >= 0 && id<this.cellCount) {
          for(k=0; k<this.cells[id].length; ++k) {

            var entx = queryParticle.x - this.cells[id][k].x;
            var enty = queryParticle.y - this.cells[id][k].y;
            var dist = entx*entx + enty*enty;

            if(dist < h2 && dist > 0.01) {
              queryParticle.neighbors[queryParticle.neighborCount] = (this.cells[id][k]);
              queryParticle.neighborCount++;
            }

          }
        }
      }
    }

  }



  function idx(x, y, width, h) {
    return Math.floor((x+h) / h) + Math.ceil((width+2*h)/h) * Math.floor((y+h)/h);
  }



  return Grid;

});
