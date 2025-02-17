class Brush{
    constructor(setPixel, size){
        this.meta = {
            'name': 'Кисть'
        }
        this.setPixel = setPixel
        this.size = size
    }
    draw(pos, style){
        this.setPixel(pos, style)
    }
}
