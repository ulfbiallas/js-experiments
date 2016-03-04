define("Simulator", ['Particle', 'Grid'], function (Particle, Grid) {

  function Simulator(width, height) {

    this.width = width;
    this.height = height;
    this.h = 5;
    this.rho0 = 0.3;
    this.k = 0.4;
    this.viscosity = 0.15;
    this.gravity = 0.1;
    this.dt = 1.0;
    this.size = 2.5;

    this.grid = new Grid(this.width, this.height, this.h);

    this.numParticles = 3000;
    this.particles = new Array(this.numParticles);
    for( i=0; i < this.numParticles; i++ ) {
      this.particles[i] = new Particle( 0.35*this.width+Math.random()*(.3*this.width), 0.35*this.height+Math.random()*(.3*this.height) );
    }

  }



  Simulator.prototype.simulate = function() {

    this.grid.calculate(this.particles);

    this.calculateDensitiesAndPressures();
    this.calculateForces();
    this.integrate();

  }



  Simulator.prototype.getWidth = function() {
    return this.width;
  }



  Simulator.prototype.getHeight = function() {
    return this.height;
  }



  Simulator.prototype.getParticles = function() {
    return this.particles;
  }



  Simulator.prototype.calculateDensitiesAndPressures = function() {
    for (var i=this.particles.length-1; i>=0; --i) {

      this.particles[i].density = 0;
      var neighbors = this.particles[i].neighbors;

      for(j = 0; j < this.particles[i].neighborCount; j++) {
        var dx = this.particles[i].x - neighbors[j].x;
        var dy = this.particles[i].y - neighbors[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        this.particles[i].density += this.particles[i].mass * (1 - dist / this.h) * (1 - dist / this.h);
      }

      if(this.particles[i].density < this.rho0) this.particles[i].density = this.rho0;
      this.particles[i].pressure = this.k * (this.particles[i].density - this.rho0);    
    }
  }



  Simulator.prototype.calculateForces = function() {
    for (var i=this.particles.length-1; i>=0; --i) {

      var neighbors = this.particles[i].neighbors;

      for(j = 0; j < this.particles[i].neighborCount; j++) {

        var dx = this.particles[i].x - neighbors[j].x;
        var dy = this.particles[i].y - neighbors[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var weight = 1 - dist / this.h;

        var pressureWeight = weight * (this.particles[i].pressure + neighbors[j].pressure) / (2 * neighbors[j].density) ;

        this.particles[i].fx += dx/dist * pressureWeight;
        this.particles[i].fy += dy/dist * pressureWeight;

        var viscosityWeight = weight / neighbors[j].density * this.viscosity;
        dx = this.particles[i].vx - neighbors[j].vx;
        dy = this.particles[i].vy - neighbors[j].vy;
        this.particles[i].fx -= dx * viscosityWeight;
        this.particles[i].fy -= dy * viscosityWeight;

      }
      this.particles[i].fy += this.gravity;
    }
  }



  Simulator.prototype.integrate = function() {
    for (var i=this.particles.length-1; i>=0; --i) {
      this.particles[i].integrate(this.dt);
    }
  }



  return Simulator;

});
