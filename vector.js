class Vector{
    constructor(x, y){
        this.x = x
        this.y = y
    }
    round(){
        return new Vector(Math.round(this.x), Math.round(this.y))
    }
}
