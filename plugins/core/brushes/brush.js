class Brush{
    constructor(canvas, size){
        this.canvas = canvas
        this.size = size
        this.meta = {
            id: 'mrybs.brush',
            name: 'Кисть'
        }
    }
    draw(pos, style){
        this.canvas.setPixel(pos, style)
    }
}
