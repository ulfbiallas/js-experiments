requirejs(['Grid', 'Particle', 'Simulator'], function (Grid, Particle, Simulator) {

  var context;
  var canvas;

  var fps = 0;
  var frames = 0;

  var isMouseDown = false;
  var mouseX = 0;
  var mouseY = 0;

  var imageWidth = 500;
  var imageHeight = 500;

  var simulator = new Simulator(imageWidth, imageHeight);



  canvas = document.getElementById('canvas'); 
  context = canvas.getContext('2d');
  canvas.width = simulator.getWidth();
  canvas.height = simulator.getHeight();

  canvas.onmousedown = function(evt) {
    isMouseDown = true;
  }

  canvas.onmouseup = function(evt) {
    isMouseDown = false;
  }

  canvas.onmousemove = function(evt) {
    mouseX = evt.layerX - this.offsetLeft;
    mouseY = evt.layerY - this.offsetTop;
  }

  setInterval(mainloop, 10);
  setInterval(calcFrameRate, 1000 );


  
  function mainloop() {

    if(isMouseDown) {
      moveParticles(mouseX, mouseY)
    }

    simulator.simulate();

    var width = simulator.getWidth();
    var height = simulator.getHeight();
    var particles = simulator.getParticles();

    for (var i=particles.length-1; i>=0; --i) {
      if(particles[i].x < 5) particles[i].vx += 5 - particles[i].x;
      if(particles[i].y < 5) particles[i].vy += 5 - particles[i].y;
      if(particles[i].x > width-5) particles[i].vx += width-5 - particles[i].x;
      if(particles[i].y > height-5) particles[i].vy += height-5 - particles[i].y; 
    }

    context.fillStyle="#ffffff";
    context.fillRect(0,0, width, height);
    for (var i=particles.length-1; i>=0; --i) {
      context.fillStyle=particles[i].color;
      context.fillRect(particles[i].x, particles[i].y, 2, 2);
    }

    context.fillStyle="#000000";
    context.fillText( 'particles: ' + particles.length , 10,15);
    context.fillText( 'fps: ' + fps, 10,30);

    frames++;
  }



  function calcFrameRate() {
    fps = frames;
    frames = 0;
  }



  function moveParticles(x, y) {
    var r = 25;
    var particles = simulator.getParticles();
    for (var i=particles.length-1; i>=0; --i) {
      var dx = particles[i].x - x;
      var dy = particles[i].y - y;
      var d = Math.sqrt(dx * dx + dy * dy);
      if(d < r) {
        particles[i].vx += 0.2 * dx / d
        particles[i].vy += 0.2 * dy / d
      }
    }
  }

});
