requirejs([], function () {

var imageWidth = 500
var imageHeight = 500

var mapWidth = 100
var mapHeight = 100

var paintingRadius = 20
var paintingStrength = 0.05

var isMouseDown = false
var mouseX = 0
var mouseY = 0

var heightmap = initHeightMap(mapWidth, mapHeight)



var canvas = document.getElementById('canvas');
canvas.width = imageWidth;
canvas.height = imageHeight;
var ctx = canvas.getContext('2d');



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






function mainloop() {
    if(isMouseDown) {
        addHeight(mouseX, mouseY)
    }

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, imageWidth, imageHeight)

    marchingSquares(0.1)
    marchingSquares(0.2)
    marchingSquares(0.3)
    marchingSquares(0.4)
    marchingSquares(0.5)
    marchingSquares(0.6)
    marchingSquares(0.7)
    marchingSquares(0.8)
    marchingSquares(0.9)
}



function initHeightMap(width, height) {
    var heightMap = new Array()
    for(var y=0; y<height; ++y) {
        for(var x=0; x<width; ++x) {
            heightMap[idx(x,y)] = 0
        }
    }
    return heightMap
}



function addHeight(mx, my) {
    mx = Math.floor(mx * mapWidth / imageWidth)
    my = Math.floor(my * mapHeight / imageHeight)

    var r = paintingRadius;
    for(var iy=-r; iy<=r; ++iy) {
        for(var ix=-r; ix<=r; ++ix) {
            var x = mx+ix;
            var y = my+iy;
            if(x>=0 && y>=0 && x<mapWidth && y<mapHeight) {
                var d = Math.sqrt(ix * ix + iy * iy);
                if(d < r) {
                    var a = Math.log(100) / (r*r)
                    heightmap[idx(x,y)] += paintingStrength * Math.exp(- (a * d*d));
                    if(heightmap[idx(x,y)] > 1) heightmap[idx(x,y)] = 1
                }
            }
        }
    }
}



function vertexInterpolation(threshold, p1, p2, val1, val2) {

    var mu = 0;
    var p = new Vec2(0, 0);

    if (Math.abs(threshold - val1) < 0.00001) return(p1)
    if (Math.abs(threshold - val2) < 0.00001) return(p2)
    if (Math.abs(val1 - val2) < 0.00001) return(p1)

    mu = (threshold - val1) / (val2 - val1);
    p.x = p1.x + mu * (p2.x - p1.x);
    p.y = p1.y + mu * (p2.y - p1.y);

    return(p);
}



function Vec2(x, y) {
    this.x = x
    this.y = y
}


function idx(x, y) {
    return y * mapWidth + x
}



function marchingSquares(threshold) {

    var cellsizeX = imageWidth / mapWidth
    var cellsizeY = imageHeight / mapHeight

    var ix, iy, id
    var val_0001, val_0010, val_0100, val_1000
    var val_0001b=0, val_0010b=0, val_0100b=0, val_1000b=0
    var val_code

    ctx.beginPath()

    for (iy = 0; iy < mapHeight-1; ++iy) {
        for (ix = 0; ix < mapWidth - 1; ++ix) {

            val_1000 = heightmap[idx(ix, iy)];
            val_0100 = heightmap[idx(ix + 1, iy)];
            val_0010 = heightmap[idx(ix + 1, iy + 1)];
            val_0001 = heightmap[idx(ix, iy + 1)];

            val_0001b = 0;
            val_0010b = 0;
            val_0100b = 0;
            val_1000b = 0;

            if (val_0001 > threshold) val_0001b = 1;
            if (val_0010 > threshold) val_0010b = 1;
            if (val_0100 > threshold) val_0100b = 1;
            if (val_1000 > threshold) val_1000b = 1;

            val_code = 8 * (val_1000b) + 4 * (val_0100b) + 2 * (val_0010b) + (val_0001b);

            var point_1000 =  new Vec2(cellsizeX * ix, cellsizeY * iy);
            var point_0100 = new Vec2(cellsizeX * ix + cellsizeX, cellsizeY * iy);
            var point_0010 =  new Vec2(cellsizeX * ix + cellsizeX, cellsizeY * iy + cellsizeY);
            var point_0001 = new Vec2(cellsizeX * ix, cellsizeY * iy + cellsizeY);

            var point_unten =  vertexInterpolation(threshold, point_0001,  point_0010, val_0001,  val_0010);
            var point_oben = vertexInterpolation(threshold, point_0100,  point_1000, val_0100,  val_1000);
            var point_links =  vertexInterpolation(threshold, point_0001,  point_1000, val_0001,  val_1000);
            var point_rechts = vertexInterpolation(threshold, point_0100,  point_0010, val_0100,  val_0010);

            switch(val_code) {

                case 0:
                    break;

                case 1:
                    ctx.moveTo(point_links.x, point_links.y);
                    ctx.lineTo(point_unten.x, point_unten.y);
                    break;

                case 2:
                    ctx.moveTo(point_rechts.x, point_rechts.y);
                    ctx.lineTo(point_unten.x, point_unten.y);
                    break;

                case 3:
                    ctx.moveTo(point_rechts.x, point_rechts.y);
                    ctx.lineTo(point_links.x, point_links.y);
                    break;

                case 4:
                    ctx.moveTo(point_rechts.x, point_rechts.y);
                    ctx.lineTo(point_oben.x, point_oben.y);
                    break;

                case 5:
                    ctx.moveTo(point_links.x, point_links.y);
                    ctx.lineTo(point_unten.x, point_unten.y);
                    ctx.moveTo(point_rechts.x, point_rechts.y);
                    ctx.lineTo(point_oben.x, point_oben.y);
                    break;

                case 6:
                    ctx.moveTo(point_oben.x, point_oben.y);
                    ctx.lineTo(point_unten.x, point_unten.y);
                    break;

                case 7:
                    ctx.moveTo(point_links.x, point_links.y);
                    ctx.lineTo(point_oben.x, point_oben.y);
                    break;

                case 8:
                    ctx.moveTo(point_links.x, point_links.y);
                    ctx.lineTo(point_oben.x, point_oben.y);
                    break;

                case 9:
                    ctx.moveTo(point_oben.x, point_oben.y);
                    ctx.lineTo(point_unten.x, point_unten.y);
                    break;

                case 10:
                    ctx.moveTo(point_rechts.x, point_rechts.y);
                    ctx.lineTo(point_unten.x, point_unten.y);
                    ctx.moveTo(point_links.x, point_links.y);
                    ctx.lineTo(point_oben.x, point_oben.y);
                    break;

                case 11:
                    ctx.moveTo(point_rechts.x, point_rechts.y);
                    ctx.lineTo(point_oben.x, point_oben.y);;
                    break;

                case 12:
                    ctx.moveTo(point_rechts.x, point_rechts.y);
                    ctx.lineTo(point_links.x, point_links.y);
                    break;

                case 13:
                    ctx.moveTo(point_rechts.x, point_rechts.y);
                    ctx.lineTo(point_unten.x, point_unten.y);
                    break;

                case 14:
                    ctx.moveTo(point_links.x, point_links.y);
                    ctx.lineTo(point_unten.x, point_unten.y);
                    break;

                case 15:
                    break;
            }


        }
    }

    ctx.stroke()
}

});
