class SquaredBrush extends Brush{
    constructor(canvas, size){
        super(canvas, size)
        this.meta = {
            id: 'mrybs.squared-brush',
            name: 'Квадратная кисть'
        }
    }
    draw(pos, color){
        for(let yi = 0; yi < this.size; yi++){
            for(let xi = 0; xi < this.size; xi++){
                if(this.size % 2 === 1) this.canvas.setPixel(new Vector(pos.x-this.size/2+xi,pos.y-this.size/2+yi).round(), color)
                else this.canvas.setPixel(new Vector(pos.x-this.size/2+xi+0.25, pos.y-this.size/2+yi+0.25).round(), color)
            }
        }
    }
}
