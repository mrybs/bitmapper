let canvas = document.getElementById('editor')
let ctx = canvas.getContext('2d')
let canvas_pos_offset = new Vector(0,0)

let number_inputs = {
    image_width: document.getElementById('image_width'),
    image_height: document.getElementById('image_height'),
}
let checkboxes = {
    show_grid: document.getElementById('show_grid')
}

let buffer = []
let params = get_params()

function update_buffer(params){
    if(buffer.length > params.image_height){
        buffer = buffer.slice(0, params.image_height)
    }
    if(buffer.length < params.image_height){
        buffer = buffer.concat(Array.from({length: params.image_height-buffer.length}, (_, i) => 
            Array.from({length: params.height-buffer.length}, (_, i) => '#000000')))
    }
    for(let i = 0; i < buffer.length; i++){
        if(buffer[i].length > params.image_width){
            buffer = buffer.slice(0, params.image_width-1)
        }
        if(buffer[i].length < params.image_width){
            buffer[i] = buffer[i].concat(Array.from({length: params.image_width-buffer[i].length}, (_, i) => '#000000'))
        }
    }
}

function get_params(){
    let _params = {}
    for (const [key, value] of Object.entries(number_inputs)) {
        _params[key] = value.value-0
    }
    for (const [key, value] of Object.entries(checkboxes)) {
        _params[key] = value.checked
    }
    return _params
}

function render(){
    let params = get_params()

    update_buffer(params)

    let canvas_rect = canvas.getBoundingClientRect()
    let max_pwh = Math.max(params.image_width, params.image_height)
    let min_wwh = Math.min(window.innerWidth, window.innerHeight)
    canvas.width = min_wwh/max_pwh*params.image_width
    canvas.height = min_wwh/max_pwh*params.image_height
    canvas.style.left=(window.innerWidth-canvas.width)/2+canvas_pos_offset.x+'px'
    canvas.style.top=(window.innerHeight-canvas.height)/2+canvas_pos_offset.y+'px'
    canvas.style.width=canvas.width+'px'
    canvas.style.height=canvas.height+'px'


    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for(let yi = 0; yi < params.image_height; yi++){
        for(let xi = 0; xi < params.image_width; xi++){
            ctx.fillStyle = buffer[yi][xi]
            ctx.fillRect(xi*canvas.width/params.image_width, yi*canvas.height/params.image_height, canvas.width/params.image_width+1, canvas.height/params.image_height+1)
        }
    }

    if(params.show_grid){
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 1;
        for(let xi = 0; xi < canvas.width; xi+=canvas.width/params.image_width){
            ctx.beginPath()
            ctx.moveTo(xi, 0)
            ctx.lineTo(xi, canvas.height)
            ctx.stroke()
        }
        for(let yi = 0; yi < canvas.height; yi+=canvas.height/params.image_height){
            ctx.beginPath()
            ctx.moveTo(0, yi)
            ctx.lineTo(canvas.width, yi)
            ctx.stroke()
        }
    }
}

function drawLine(p0, p1, color){
    let dx = Math.abs(p0.x - p1.x)
    let dy = Math.abs(p0.y - p1.y)
    let error = 0
    if(dy/dx < 1) {
        let derror = dy + 1
        let y = Math.min(p0.y, p1.y)
        let diry = 0
        if (dy > 0) diry = 1
        if (dy < 0) diry = -1
        for (let x = Math.min(p0.x, p1.x); x < Math.max(p0.x, p1.x); x++) {
            buffer[y][x] = color
            error += derror
            if (error >= dx + 1) {
                y += diry
                error -= dx + 1
            }
        }
    }else{
        let derror = dx + 1
        let x = Math.min(p0.x, p1.x)
        let dirx = 0
        if (dx > 0) dirx = 1
        if (dx < 0) dirx = -1
        for (let y = Math.min(p0.y, p1.y); y < Math.max(p0.y, p1.y); y++) {
            buffer[y][x] = color
            error += derror
            if (error >= dy + 1) {
                x += dirx
                error -= dy + 1
            }
        }
    }
}

let leftPressed = false
let rightPressed = false
let lastPoint = null

render()

function windowToCanvas(cnvs, x, y) {
    let bbox = cnvs.getBoundingClientRect();
    return { x: x - bbox.left * (cnvs.width / bbox.width),
        y: y - bbox.top * (cnvs.height / bbox.height)
    };
}

canvas.addEventListener('mouseup', function(event){
    event.preventDefault()
    rightPressed = false
    leftPressed = false
    lastPoint = null
    render()
})

canvas.addEventListener('mousedown', function(event){
    event.preventDefault()
    rightPressed = event.button === 2
    leftPressed = event.button === 0
    render()
})

canvas.addEventListener('mousemove', function(event){
    event.preventDefault()
	let pos = windowToCanvas(canvas, event.clientX, event.clientY)
    params = get_params()
    if(rightPressed){
        canvas_pos_offset.x += event.movementX
        canvas_pos_offset.y += event.movementY
    }
    if(leftPressed){
        let currentPoint = new Vector(Math.floor(pos.x/canvas.width*params.image_width), Math.floor(pos.y/canvas.height*params.image_height))
        if(lastPoint != null) drawLine(currentPoint, lastPoint, 'orange')
        else buffer[currentPoint.y][currentPoint.x] = 'orange'
        lastPoint = structuredClone(currentPoint)
        //buffer[currentPoint.y][currentPoint.x] = 'orange'
    }
    render()
})

canvas.addEventListener('contextmenu', event => {
    event.preventDefault();
});
