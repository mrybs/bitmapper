class SquaredBrush extends Brush{
    constructor(canvas, size){
        super(canvas, size)
        this.meta = {
            'name': 'Квадратная кисть'
        }
    }
    draw(pos, style){
        for(let yi = 0; yi < this.size; yi++){
            for(let xi = 0; xi < this.size; xi++){
                if(this.size % 2 === 1) this.canvas.setPixel(new Vector(Math.round(pos.x-this.size/2+xi), Math.round(pos.y-this.size/2+yi)), style)
                else this.canvas.setPixel(new Vector(Math.round(pos.x-this.size/2+xi+0.25), Math.round(pos.y-this.size/2+yi+0.25)), style)
            }
        }
    }
}
