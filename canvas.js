class Canvas{
    constructor(projectSettings){
        this.projectSettings = projectSettings
        this.canvas = document.getElementById('editor')
        this.ctx = this.canvas.getContext('2d')
        this.canvasPosOffset = new Vector(0,0)
        this.zoom = 1
        this.buffer = []
        for(let yi = 0; yi < this.projectSettings.image_height; yi++){
            this.buffer.push([])
            for(let xi = 0; xi < this.projectSettings.image_width; xi++){
                this.buffer[this.buffer.length-1].push('#000000')
            }
        }
        //this.params = get_params()
        this.currentBrush = new Brush(this, 1)
        this.pointsToDraw = []
        this.maxFramerate = 165
        this.leftPressed = false
        this.rightPressed = false
        this.lastPoint = null

        this.number_inputs = {
            //image_width: document.getElementById('image_width'),
            //image_height: document.getElementById('image_height'),
        }
        this.checkboxes = {
            show_grid: document.getElementById('show_grid')
        }

        setInterval(() => {
            while(this.pointsToDraw.length > 0) {
                let point = this.pointsToDraw.shift()
                this.ctx.fillStyle = point.style
                this.ctx.fillRect(point.pos.x * this.canvas.width / this.projectSettings.image_width,
                                  point.pos.y * this.canvas.height / this.projectSettings.image_height,
                                  this.canvas.width / this.projectSettings.image_width,
                                  this.canvas.height / this.projectSettings.image_height)
                this.buffer[point.pos.y][point.pos.x] = point.style
            }
        }, 1/this.maxFramerate)


        function windowToCanvas(cnvs, x, y) {
            let bbox = cnvs.getBoundingClientRect();
            return { x: x - bbox.left * (cnvs.width / bbox.width),
                y: y - bbox.top * (cnvs.height / bbox.height)
            };
        }

        this.canvas.addEventListener('mousedown', event =>{
            event.preventDefault();
            this.start_action(event, 0)
        })
        this.canvas.addEventListener('touchstart', event =>{
            event.preventDefault();
            this.start_action(event.touches[0], 1)
        })
        this.canvas.addEventListener('mouseenter', event =>{
            event.preventDefault();
            if(event.buttons === 1) this.start_action(event, 0)
        })
        this.canvas.addEventListener('mousemove', event =>{
            event.preventDefault();
            this.move_action(event, 0)
        })
        this.canvas.addEventListener('touchmove', event =>{
            event.preventDefault();
            this.move_action(event.touches[0], 1)
        })
        this.canvas.addEventListener('mouseup', event => {
            this.end_action(event)
        })
        this.canvas.addEventListener('mouseout', event => {
            this.end_action(event)
        })
        this.canvas.addEventListener('touchend', event => {
            this.end_action(event)
        })
        this.canvas.addEventListener('touchcancel', event => {
            this.end_action(event)
        })
        this.canvas.addEventListener('contextmenu', event => {
            event.preventDefault();
        });
        this.canvas.addEventListener('wheel', event => {
            event.preventDefault();
            this.zoom *= (1 + event.deltaY/2000)
            this.render()
        })


        document.getElementById('save_button').addEventListener('click', () => {
            this.render()
            const link = document.createElement('a');
            link.download = 'canvas_image.png';
            link.href = this.canvas.toDataURL();
            link.click();
            link.remove();
        });
    }
    setPixel(pos, style){
        this.pointsToDraw.push({pos: pos, style:style})
    }
    get_drawingSettings(){
        let drawingSettings = {}
        for (const [key, value] of Object.entries(this.number_inputs)) {
            drawingSettings[key] = value.value-0
        }
        for (const [key, value] of Object.entries(this.checkboxes)) {
            drawingSettings[key] = value.checked
        }
        return drawingSettings
    }
    resizeCanvas(){
        let canvas_rect = this.canvas.getBoundingClientRect()
        let max_pwh = Math.max(this.projectSettings.image_width, this.projectSettings.image_height)
        let min_wwh = Math.min(window.innerWidth, window.innerHeight)
        this.canvas.width = min_wwh/max_pwh*this.projectSettings.image_width*this.zoom
        this.canvas.height = min_wwh/max_pwh*this.projectSettings.image_height*this.zoom
        this.canvas.style.width=this.canvas.width+'px'
        this.canvas.style.height=this.canvas.height+'px'
    }
    locateCanvas(params){
        this.canvas.style.left=(window.innerWidth-this.canvas.width)/2+this.canvasPosOffset.x*this.zoom+'px'
        this.canvas.style.top=(window.innerHeight-this.canvas.height)/2+this.canvasPosOffset.y*this.zoom+'px'
    }
    renderGrid(){
        this.ctx.strokeStyle = '#ffffff'
        this.ctx.lineWidth = 1;
        for(let xi = 0; xi < this.canvas.width; xi+=this.canvas.width/this.projectSettings.image_width){
            this.ctx.beginPath()
            this.ctx.moveTo(xi, 0)
            this.ctx.lineTo(xi, this.canvas.height)
            this.ctx.stroke()
        }
        for(let yi = 0; yi < this.canvas.height; yi+=this.canvas.height/this.projectSettings.image_height){
            this.ctx.beginPath()
            this.ctx.moveTo(0, yi)
            this.ctx.lineTo(this.canvas.width, yi)
            this.ctx.stroke()
        }
    }
    render(){
        let params = this.get_drawingSettings()

        this.resizeCanvas(params)
        this.locateCanvas(params)

        this.ctx.fillStyle = '#ffffff'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        for(let yi = 0; yi < this.projectSettings.image_height; yi++){
            for(let xi = 0; xi < this.projectSettings.image_width; xi++){
                this.ctx.fillStyle = this.buffer[yi][xi]
                this.ctx.fillRect(xi*this.canvas.width/this.projectSettings.image_width,
                    yi*this.canvas.height/this.projectSettings.image_height,
                    this.canvas.width/this.projectSettings.image_width+1,
                    this.canvas.height/this.projectSettings.image_height+1)
            }
        }

        if(params.show_grid){
            this.renderGrid()
        }
    }
    drawLine(start, end, style) {
        let x0 = start.x;
        let y0 = start.y;
        const x1 = end.x;
        const y1 = end.y;

        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;

        while (true) {
            this.currentBrush.draw(new Vector(x0, y0), selectedColor)

            if(x0 === x1 && y0 === y1) break;

            const e2 = 2 * err;
            if(e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if(e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }
    }
    start_action(event, type=0){
        if(type === 0){
            this.rightPressed = event.button === 2
            this.leftPressed = event.button === 0
        }else if(type === 1){
            this.leftPressed = true
        }
        this.triggerMouseDraw(event)
    }
    move_action(event, type){
        this.triggerMouseDraw(event, type)
    }
    triggerMouseDraw(event, type=0){
        let pos = windowToCanvas(this.canvas, event.clientX, event.clientY)
        if(this.rightPressed){
            if(type === 0){
                this.canvasPosOffset.x += event.movementX/this.zoom
                this.canvasPosOffset.y += event.movementY/this.zoom
            }else if(type === 1){}
            this.locateCanvas(this.get_drawingSettings())
        }
        if(this.leftPressed){
            let currentPoint = new Vector(Math.floor(pos.x/this.canvas.width*this.projectSettings.image_width),
                Math.floor(pos.y / this.canvas.height * this.projectSettings.image_height))
            if (this.lastPoint != null) this.drawLine(currentPoint, this.lastPoint, selectedColor)
            else this.currentBrush.draw(currentPoint, selectedColor)
            this.lastPoint = structuredClone(currentPoint)
        }
    }
    end_action(event){
        event.preventDefault()
        this.rightPressed = false
        this.leftPressed = false
        this.lastPoint = null
    }
}


