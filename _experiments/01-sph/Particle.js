define("Particle", function () {

  function Particle( x, y ) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.fx = 0;
    this.fy = 0;

    this.density = 0;
    this.pressure = 0;
    this.mass = 1;

    this.neighbors = new Array();
    this.neighborCount = 0;

  }



  Particle.prototype.integrate = function(dt) {
    this.vx += dt*this.fx;
    this.vy += dt*this.fy;

    this.x += dt*this.vx;
    this.y += dt*this.vy;

    this.vx *= 0.99;
    this.vy *= 0.99;
    this.fx = 0;
    this.fy = 0;  
  }



  return Particle;
});
