let colorPickerCanvas = document.getElementById('colorpicker')
let colorPickerCtx = colorPickerCanvas.getContext('2d')
colorPickerCtx.globalAlpha = 1.0; // Полная непрозрачность
colorPickerCtx.globalCompositeOperation = "source-over";
let pickerPos = new Vector(128, 128)
let huePickerPos = 0
let colorPickerLeftPressed = false
let buffer1 = 0

function toPolar(p){
    theta = Math.atan(p.y/p.x)
    if(p.x < 0 && p.y === 0) theta += Math.PI
    if(p.x < 0 && p.y < 0) theta -= Math.PI
    if(p.x === 0 && p.y > 0) theta = Math.PI/2
    if(p.x === 0 && p.y < 0) theta = -Math.PI/2
    if(p.x < 0 && p.y > 0) theta -= Math.PI
    return new Vector(Math.sqrt(p.x**2+p.y**2), theta)
}
function toDecart(p){
    return new Vector(p.x*Math.cos(p.y),p.x*Math.sin(p.y))
}

function distance(p1, p2){
    return Math.sqrt((p1.x - p2.x)**2+(p2.y - p1.y)**2)
}

function getTriagnleColor(pc){
    rotatedp = toPolar(pc)
    rotatedp.y -= huePickerPos
    rotateddc = toDecart(rotatedp)
    rotatedd = new Vector(rotateddc.x+127-25, rotateddc.y+127-25)
    return `hsl(${huePickerPos}rad, ${rotatedd.x/2.06}%, ${100-rotatedd.y/2.06}%)` 
}

function colorPickerRender(){
    colorPickerCanvas.width = 306
    colorPickerCanvas.height = 306

    a1 = 5.759586531581287 + huePickerPos
    a2 = 3.6651914291880923 + huePickerPos
    a3 = 1.5707963267948966 + huePickerPos
    p1 = new Vector(127+127*Math.sin(a1),127+127*Math.cos(a1))
    p2 = new Vector(127+127*Math.sin(a2),127+127*Math.cos(a2))
    p3 = new Vector(127+127*Math.sin(a3),127+127*Math.cos(a3))
    console.log([p1,p2,p3])
    for(let yi = 0; yi < 306; yi++) {
        for (let xi = 0; xi < 306; xi++) {
            t = new Vector(xi-25, yi-25)
            tc = new Vector(xi-25-127, yi-25-127)
            rt = toPolar(tc)
            colorPickerCtx.fillStyle='#212121'
            if(t.y*(p2.x-p1.x)>(p2.y-p1.y)*(t.x-p2.x)+p2.y*(p2.x-p1.x)&&
               t.y*(p3.x-p2.x)>(p3.y-p2.y)*(t.x-p3.x)+p3.y*(p3.x-p2.x)&&
               t.y*(p3.x-p1.x)<(p3.y-p1.y)*(t.x-p1.x)+p1.y*(p3.x-p1.x)// || 1
            ){
                colorPickerCtx.fillStyle = getTriagnleColor(tc)
            }
            if(rt.x > 127 && rt.x < 153) colorPickerCtx.fillStyle=`hsl(${rt.y}rad, 100%, 50%)`
            colorPickerCtx.fillRect(xi, yi, 1, 1)
        }
    }
    drawColorPicker()
    drawHuePicker()
}
function drawColorPicker(){
    buffer1 = colorPickerCtx.getImageData(pickerPos.x-12, pickerPos.y-12, pickerPos.x+12, pickerPos.y+12);
    colorPickerCtx.beginPath();
    colorPickerCtx.arc(pickerPos.x, pickerPos.y, 7.5, 0, 2 * Math.PI);
    colorPickerCtx.fillStyle = getTriagnleColor(new Vector(pickerPos.x-25-127, pickerPos.y-25-127));
    colorPickerCtx.fill();
    colorPickerCtx.lineWidth = 4;
    colorPickerCtx.strokeStyle = "white";
    colorPickerCtx.stroke();
}
function drawHuePicker(){
    colorPickerCtx.beginPath();
    colorPickerCtx.arc(153, 153, 153-2, (huePickerPos-0.06)%(2*Math.PI), (huePickerPos+0.06)%(2*Math.PI));
    let p = toDecart(new Vector(153-2, (huePickerPos-0.06)%(2*Math.PI)))
    p.x += 153; p.y += 153
    colorPickerCtx.lineTo(p.x, p.y);
    colorPickerCtx.arc(153, 153, 127, (huePickerPos-0.06)%(2*Math.PI), (huePickerPos+0.06)%(2*Math.PI));
    p = toDecart(new Vector(153-2, (huePickerPos+0.06)%(2*Math.PI)))
    p.x += 153; p.y += 153
    colorPickerCtx.lineTo(p.x, p.y);
    colorPickerCtx.lineWidth = 4;
    colorPickerCtx.strokeStyle = "white";
    colorPickerCtx.stroke();
}

setInterval(() => {
    drawHuePicker()
    colorPickerRender()
    huePickerPos += 0.01
}, 10000)

function windowToCanvas(cnvs, x, y) {
    let bbox = cnvs.getBoundingClientRect();
    return { x: x - bbox.left * (cnvs.width / bbox.width),
        y: y - bbox.top * (cnvs.height / bbox.height)
    };
}

colorPickerCanvas.addEventListener('mouseup', function(event){
    event.preventDefault()
    colorPickerLeftPressed = false
    lastPoint = null
})

colorPickerCanvas.addEventListener('mousedown', function(event){
    event.preventDefault()
    colorPickerLeftPressed = event.button === 0
})

colorPickerCanvas.addEventListener('mousemove', function(event){
    event.preventDefault()
	let pos = windowToCanvas(colorPickerCanvas, event.clientX, event.clientY)
    polarPos = toPolar(new Vector(pos.x-153, pos.y-153))
    params = get_params()
    if(colorPickerLeftPressed){
        if(distance(pos, pickerPos) <= 11.5){
            a1 = 5.759586531581287 + huePickerPos
            a2 = 3.6651914291880923 + huePickerPos
            a3 = 1.5707963267948966 + huePickerPos
            p1 = new Vector(127+25+127*Math.sin(a1),127+25+127*Math.cos(a1))
            p2 = new Vector(127+25+127*Math.sin(a2),127+25+127*Math.cos(a2))
            p3 = new Vector(127+25+127*Math.sin(a3),127+25+127*Math.cos(a3))
            if(pos.y*(p2.x-p1.x)>(p2.y-p1.y)*(pos.x-p2.x)+p2.y*(p2.x-p1.x)&&
               pos.y*(p3.x-p2.x)>(p3.y-p2.y)*(pos.x-p3.x)+p3.y*(p3.x-p2.x)&&
               pos.y*(p3.x-p1.x)<(p3.y-p1.y)*(pos.x-p1.x)+p1.y*(p3.x-p1.x)
            ){
                if(buffer1 != 0){
                    colorPickerCtx.putImageData(buffer1, pickerPos.x-12, pickerPos.y-12);
                }
                pickerPos = new Vector(pos.x, pos.y)
                drawColorPicker()
            }
        }else{
            tc = new Vector(pos.x-25-127, pos.y-25-127)
            rt = toPolar(tc)
            if(rt.x > 127 && rt.x < 153){

            }
        }
    }else if(polarPos.x > 127 && polarPos.x < 153 && polarPos.y > (huePickerPos-0.06)%(2*Math.PI) && polarPos.y < (huePickerPos+0.06)%(2*Math.PI)){
        console.log('на кружочке')
    }
})

colorPickerRender()