class Brush{
    constructor(canvas, size){
        this.meta = {
            'name': 'Кисть'
        }
        this.canvas = canvas
        this.size = size
    }
    draw(pos, style){
        this.canvas.setPixel(pos, style)
    }
}
