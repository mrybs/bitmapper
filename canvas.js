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
let currentBrush = new Brush(setPixel, 1)

function setPixel(pos, style){
    ctx.fillStyle = style
    ctx.fillRect(pos.x*canvas.width/params.image_width, pos.y*canvas.height/params.image_height, canvas.width/params.image_width+0.5, canvas.height/params.image_height+0.5)
    buffer[pos.y][pos.x] = style
    //ctx.strokeStyle = 'white'
    //ctx.strokeRect(pos.x*canvas.width/params.image_width, pos.y*canvas.height/params.image_height, canvas.width/params.image_width+0.5, canvas.height/params.image_height+0.5)
}

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
            buffer[i] = buffer[i].slice(0, params.image_width-1)
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

function resizeCanvas(params){
    let canvas_rect = canvas.getBoundingClientRect()
    let max_pwh = Math.max(params.image_width, params.image_height)
    let min_wwh = Math.min(window.innerWidth, window.innerHeight)
    canvas.width = min_wwh/max_pwh*params.image_width
    canvas.height = min_wwh/max_pwh*params.image_height
    canvas.style.width=canvas.width+'px'
    canvas.style.height=canvas.height+'px'
}

function locateCanvas(params){
    canvas.style.left=(window.innerWidth-canvas.width)/2+canvas_pos_offset.x+'px'
    canvas.style.top=(window.innerHeight-canvas.height)/2+canvas_pos_offset.y+'px'
}

function renderGrid(){
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

function render(){
    let params = get_params()

    update_buffer(params)
    resizeCanvas(params)
    locateCanvas(params)

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for(let yi = 0; yi < params.image_height; yi++){
        for(let xi = 0; xi < params.image_width; xi++){
            ctx.fillStyle = buffer[yi][xi]
            ctx.fillRect(xi*canvas.width/params.image_width, yi*canvas.height/params.image_height, canvas.width/params.image_width+1, canvas.height/params.image_height+1)
        }
    }

    if(params.show_grid){
        renderGrid()
    }
}

function drawLine(start, end, style) {
    let x0 = start.x;
    let y0 = start.y;
    const x1 = end.x;
    const y1 = end.y;
    
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while(true) {
        //setPixel(new Vector(x0, y0), style);
        currentBrush.draw(new Vector(x0, y0), style)
        
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

canvas.addEventListener('mouseup', end_action)
canvas.addEventListener('mouseout', end_action)
canvas.addEventListener('touchend', end_action)
function end_action(event){
    event.preventDefault()
    rightPressed = false
    leftPressed = false
    lastPoint = null
    //render()
}

canvas.addEventListener('mousedown', (e)=>{
    e.preventDefault();
    start_action(e, 0)
})
canvas.addEventListener('mouseenter', (e)=>{
    e.preventDefault();
    console.log(e)
    if(e.buttons === 1) start_action(e, 0)
})
canvas.addEventListener('touchstart', (e)=>{
    e.preventDefault();
    start_action(e.touches[0], 1)
})
function start_action(event, type=0){
    if(type === 0){
        rightPressed = event.button === 2
        leftPressed = event.button === 0
    }else if(type === 1){
        leftPressed = true
    }
    triggerMouseDraw(event)
}

canvas.addEventListener('mousemove', (e)=>{e.preventDefault();move_action(e, 0)})
canvas.addEventListener('touchmove', (e)=>{e.preventDefault();move_action(e.touches[0], 1)})
function move_action(event, type){
	triggerMouseDraw(event, type)
}

function triggerMouseDraw(event, type=0){
    let pos = windowToCanvas(canvas, event.clientX, event.clientY)
    params = get_params()
    if(rightPressed){
        console.log(event)
        if(type === 0){
            canvas_pos_offset.x += event.movementX
            canvas_pos_offset.y += event.movementY
        }else if(type === 1){}
        locateCanvas(get_params())
    }
    if(leftPressed){
        let currentPoint = new Vector(Math.floor(pos.x/canvas.width*params.image_width), Math.floor(pos.y/canvas.height*params.image_height))
        console.log(currentPoint)
        //if(lastPoint != null) drawLine(currentPoint, lastPoint, 'orange')
        //else buffer[currentPoint.y][currentPoint.x] = 'orange'
        if(lastPoint != null) drawLine(currentPoint, lastPoint, 'orange')
        //else setPixel(new Vector(currentPoint.x, currentPoint.y), 'orange')
        else currentBrush.draw(currentPoint, 'orange')
        lastPoint = structuredClone(currentPoint)
        //buffer[currentPoint.y][currentPoint.x] = 'orange'
    }
    //render()
}

const saveButton = document.getElementById('save_button');

// Добавляем обработчик клика на кнопку
saveButton.addEventListener('click', function() {
    render()
    // Создаем временную ссылку
    const link = document.createElement('a');

    // Генерируем Data URL изображения в формате PNG
    link.download = 'canvas_image.png'; // Имя файла
    link.href = canvas.toDataURL();     // Преобразуем canvas в изображение

    // Программно кликаем по ссылке для скачивания
    link.click();

    // Удаляем ссылку из DOM
    link.remove();
});


canvas.addEventListener('contextmenu', event => {
    event.preventDefault();
});
