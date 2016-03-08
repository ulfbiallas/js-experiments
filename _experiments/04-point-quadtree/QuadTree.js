define("QuadTree", ['Vec2'], function (Vec2) {

    function QuadTree(startX, startY, width, height) {
        this.startX = startX
        this.startY = startY
        this.width = width
        this.height = height

        this.minWidth = 4
        this.minHeight = 4

        this.centerX = this.startX + 0.5 * this.width
        this.centerY = this.startY + 0.5 * this.height

        this.points = new Array()

        this.hasChildren = false
    }

    QuadTree.prototype.addPoint = function(v) {
        if(this.hasChildren) {
            this.addToChild(v)
        } else {
            if(this.points.length > 0 && this.width > this.minWidth && this.height > this.minHeight) {
                this.q1 = new QuadTree(this.centerX, this.startY, 0.5 * this.width, 0.5 * this.height);
                this.q2 = new QuadTree(this.startX, this.startY, 0.5 * this.width, 0.5 * this.height);
                this.q3 = new QuadTree(this.startX, this.centerY, 0.5 * this.width, 0.5 * this.height);
                this.q4 = new QuadTree(this.centerX, this.centerY, 0.5 * this.width, 0.5 * this.height);
                this.hasChildren = true
                this.addToChild(v)
                this.addToChild(this.points[0])
                this.points = []
            } else {
                this.points.push(v)
            }
        }
    }

    QuadTree.prototype.addToChild = function(v) {
        if(v.x < this.centerX) {
            if(v.y < this.centerY) {
                this.q2.addPoint(v)
            } else {
                this.q3.addPoint(v)
            }
        } else {
            if(v.y < this.centerY) {
                this.q1.addPoint(v)
            } else {
                this.q4.addPoint(v)
            }
        }
    }

    QuadTree.prototype.draw = function(context) {
        if(this.hasChildren) {
            context.lineWidth = 1;
            context.beginPath()
            context.moveTo(this.startX, this.centerY)
            context.lineTo(this.startX+this.width, this.centerY)
            context.moveTo(this.centerX, this.startY)
            context.lineTo(this.centerX, this.startY+this.height)
            context.stroke()

            this.q1.draw(context)
            this.q2.draw(context)
            this.q3.draw(context)
            this.q4.draw(context)
        } else {
            for(var k=0; k<this.points.length; ++k) {
                context.fillStyle = 'black'
                context.fillRect(this.points[k].x-1, this.points[k].y-1, 3, 3); 
            }
        }
    }

    return QuadTree;
});