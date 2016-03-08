requirejs(['QuadTree', 'Vec2'], function (QuadTree, Vec2) {

    var imageWidth = 512
    var imageHeight = 512

    var canvas = document.getElementById('canvas')
    canvas.width = imageWidth
    canvas.height = imageHeight

    var context = canvas.getContext('2d')
    context.fillStyle = 'white'
    context.fillRect(0, 0, imageWidth, imageHeight)

    var quadTree = new QuadTree(0, 0, imageWidth, imageHeight)

    var isMouseDown = false
    canvas.onmousedown = function(mouseEvent) {
        isMouseDown = true
        addPoint(mouseEvent)
    }
    canvas.onmouseup = function(mouseEvent) {
        isMouseDown = false
    }
    canvas.onmousemove = function(mouseEvent) {
        if(isMouseDown) {
            addPoint(mouseEvent)
        }
    }

    function addPoint(mouseEvent) {
        mouseX = mouseEvent.pageX - canvas.offsetLeft
        mouseY = mouseEvent.pageY - canvas.offsetTop
        quadTree.addPoint(new Vec2(mouseX, mouseY))

        context.fillStyle = 'white'
        context.fillRect(0, 0, imageWidth, imageHeight)
        quadTree.draw(context)
    }

});

