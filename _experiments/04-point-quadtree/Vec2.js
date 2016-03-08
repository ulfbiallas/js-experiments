define("Vec2", function () {

    function Vec2(x, y) {
        this.x = x
        this.y = y
    }

    Vec2.prototype.add = function(v) {
        return new Vec2(this.x + v.x, this.y + v.y)
    }

    Vec2.prototype.sub = function(v) {
        return new Vec2(this.x - v.x, this.y - v.y)
    }

    Vec2.prototype.scale = function(s) {
        return new Vec2(this.x * s, this.y * s)
    }

    Vec2.prototype.dot = function(v) {
        return this.x * v.x + this.y * v.y
    }

    Vec2.prototype.norm2 = function() {
        return this.x * this.x + this.y * this.y
    }

    Vec2.prototype.norm = function() {
        return Math.sqrt(this.norm2())
    }

    return Vec2
});