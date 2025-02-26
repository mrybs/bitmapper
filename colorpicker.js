let colorPickerCanvas = document.getElementById('colorpicker')
let colorPickerCtx = colorPickerCanvas.getContext('2d', {
    willReadFrequently: true
})
colorPickerCtx.globalAlpha = 1.0; // Полная непрозрачность
colorPickerCtx.globalCompositeOperation = "source-over";
let pickerPos = new Vector(128, 128)
let huePickerPos = 0
let colorPickerLeftPressed = false
let dragPicker = false
let dragHuePicker = false
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
    rotatedd = new Vector(rotateddc.x+127-50, rotateddc.y+127-25)
    //return `hsl(${huePickerPos}rad, ${rotatedd.x/2.06}%, ${100-rotatedd.y/2.06}%)`
    return hslToRgb(huePickerPos, rotatedd.x/2.06, 100-rotatedd.y/2.06)
}

function hueToRgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
}

function hslToRgb(h, s, l) {
    h/=Math.PI*2; s/=100; l/=100;
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueToRgb(p, q, h + 1/3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
/*const hslToRgb = (h, s, l) => {
    h/=Math.PI*2;
    s/=100;
    l/=100;
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [ r * 255, g * 255, b * 255 ];
};*/

function colorPickerRender(){
    colorPickerCanvas.width = 306
    colorPickerCanvas.height = 306
    a1 = 5.759586531581287 - huePickerPos
    a2 = 3.6651914291880923 - huePickerPos
    a3 = 1.5707963267948966 - huePickerPos
    p1 = new Vector(127+127*Math.sin(a1),127+127*Math.cos(a1))
    p2 = new Vector(127+127*Math.sin(a2),127+127*Math.cos(a2))
    p3 = new Vector(127+127*Math.sin(a3),127+127*Math.cos(a3))
    const imageData = colorPickerCtx.createImageData(306, 306);
    const data = imageData.data;
    for(let yi = 0; yi < 306; yi++) {
        for (let xi = 0; xi < 306; xi++) {
            let t = new Vector(xi-25, yi-25)
            let tc = new Vector(xi-25-127, yi-25-127)
            let rt = toPolar(tc)
            let rgb = [33, 33, 33]
            if(t.y*(p2.x-p1.x)>(p2.y-p1.y)*(t.x-p2.x)+p2.y*(p2.x-p1.x)&&
               t.y*(p3.x-p2.x)>(p3.y-p2.y)*(t.x-p3.x)+p3.y*(p3.x-p2.x)&&
               t.y*(p3.x-p1.x)<(p3.y-p1.y)*(t.x-p1.x)+p1.y*(p3.x-p1.x)// || 1
            ){
                //colorPickerCtx.fillStyle = getTriagnleColor(tc)
                rgb = getTriagnleColor(tc)
                //if(0 > rgb[0] || rgb[0] > 255 || 0 > rgb[1] || rgb[1] > 255 || 0 > rgb[2] || rgb[2] > 255) rgb=[0,255,255]
            }
            //if(rt.x > 127 && rt.x < 153) colorPickerCtx.fillStyle=`hsl(${rt.y}rad, 100%, 50%)`
            const i = (yi * 306 + xi) * 4;
            if(rt.x > 127 && rt.x < 153) rgb = hslToRgb(rt.y, 100, 50)
            data[i] = rgb[0]
            data[i + 1] = rgb[1]
            data[i + 2] = rgb[2]
            data[i + 3] = 255
            //colorPickerCtx.fillRect(xi, yi, 1, 1)
        }
    }
    colorPickerCtx.putImageData(imageData, 0, 0);
    drawColorPicker()
    drawHuePicker()
}
function drawColorPicker(){
    buffer1 = colorPickerCtx.getImageData(pickerPos.x-12, pickerPos.y-12, pickerPos.x+12, pickerPos.y+12);
    colorPickerCtx.beginPath();
    colorPickerCtx.arc(pickerPos.x, pickerPos.y, 7.5, 0, 2 * Math.PI);
    let rgb = getTriagnleColor(new Vector(pickerPos.x-25-127, pickerPos.y-25-127));
    colorPickerCtx.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
    selectedColor = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
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
    colorPickerCtx.fillStyle = `hsl(${huePickerPos}rad, 100%, 50%)`
    colorPickerCtx.fill()
    colorPickerCtx.stroke()
}

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
    dragPicker = false
    dragHuePicker = false
})
colorPickerCanvas.addEventListener('touchend', function(event){
    event.preventDefault()
    colorPickerLeftPressed = false
    lastPoint = null
    dragPicker = false
    dragHuePicker = false
})

colorPickerCanvas.addEventListener('mousedown', function(event){
    event.preventDefault()
    colorPickerLeftPressed = event.button === 0
    startmove(event)
    mousemove(event)
})
colorPickerCanvas.addEventListener('touchstart', function(event){
    event.preventDefault()
    colorPickerLeftPressed = true
    startmove(event.touches[0])
    mousemove(event.touches[0])
})


colorPickerCanvas.addEventListener('mousemove', function(event){
    event.preventDefault()
	mousemove(event)
})
colorPickerCanvas.addEventListener('touchmove', function(event){
    event.preventDefault()
	mousemove(event.touches[0])
})
function startmove(event){
    let pos = windowToCanvas(colorPickerCanvas, event.clientX, event.clientY)
    if(distance(pos, pickerPos) <= 11.5) {
        dragPicker = true
    }
    tc = new Vector(pos.x-25-127, pos.y-25-127)
    rt = toPolar(tc)
    if(rt.x > 127 && rt.x < 153){
        dragHuePicker = true
    }
}

function mousemove(event){
    let pos = windowToCanvas(colorPickerCanvas, event.clientX, event.clientY)
    polarPos = toPolar(new Vector(pos.x-153, pos.y-153))
    if(colorPickerLeftPressed){
        if(!dragHuePicker) {
            a1 = 5.759586531581287 - huePickerPos
            a2 = 3.6651914291880923 - huePickerPos
            a3 = 1.5707963267948966 - huePickerPos
            p1 = new Vector(127 + 25 + 127 * Math.sin(a1), 127 + 25 + 127 * Math.cos(a1))
            p2 = new Vector(127 + 25 + 127 * Math.sin(a2), 127 + 25 + 127 * Math.cos(a2))
            p3 = new Vector(127 + 25 + 127 * Math.sin(a3), 127 + 25 + 127 * Math.cos(a3))
            if (pos.y * (p2.x - p1.x) > (p2.y - p1.y) * (pos.x - p2.x) + p2.y * (p2.x - p1.x) &&
                pos.y * (p3.x - p2.x) > (p3.y - p2.y) * (pos.x - p3.x) + p3.y * (p3.x - p2.x) &&
                pos.y * (p3.x - p1.x) < (p3.y - p1.y) * (pos.x - p1.x) + p1.y * (p3.x - p1.x)
            ) {
                if (buffer1 !== 0) {
                    colorPickerCtx.putImageData(buffer1, pickerPos.x - 12, pickerPos.y - 12);
                }
                pickerPos = new Vector(pos.x, pos.y)
                drawColorPicker()
            }
        }else if(dragHuePicker){
            delta = polarPos.y - huePickerPos
            huePickerPos = polarPos.y
            pickerPosPolar = toPolar(new Vector(pickerPos.x-153, pickerPos.y-153))
            pickerPosPolar.y += delta
            pickerPos = toDecart(pickerPosPolar)
            pickerPos.x += 153
            pickerPos.y += 153
            colorPickerRender()
        }
    }
}

function getColorRGB(){
    return getTriagnleColor(new Vector(pickerPos.x-25-127, pickerPos.y-25-127))
}
let selectedColor = 'orange';