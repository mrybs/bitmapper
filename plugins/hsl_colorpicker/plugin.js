class HSLColorPickerPlugin extends Plugin {
    constructor() {
        super();
        this.meta = {
            id: 'mrybs.hsl-colorpicker',
            name: 'HSL Colorpicker',
            version: '0.0.1',
            author: 'Mr. Ybs',
            require: [
                'mrybs.core'
            ]
        }
    }

    load(){
        this.HSLColorPicker = HSLColorPicker
    }
}

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

function nearestPointToLine(a, b, i){
    //l = ((i.y - b.y) * (b.y - a.y) * (b.x - a.x) + b.x * (b.y - a.y)**2 + i.x * (b.x - a.x)**2) / ((b.y - a.y)**2 + (b.x - a.x)**2)
    x = ((i.y - b.y) * (b.y - a.y) * (b.x - a.x) + b.x * (b.y - a.y)**2 + i.x * (b.x - a.x)**2) / ((b.y - a.y)**2 + (b.x - a.x)**2)
    y = ((a.x - b.x) / (b.y - a.y)) * (x - i.x) + i.y
    return new Vector(x, y)
}

/*function isPointOnLine(a, b, i){
    //if((b.y - a.y) / (b.x - a.x) * i.x + b.x * (a.y - b.y) / (b.x - a.x) + b.y != i.y) return false
    //let t = (i.x - a.x) / (b.x - a.x)
    //return 0 <= t && t <= 1
    a = roundVector(a)
    b = roundVector(b)
    i = roundVector(i)
    if(Math.round((b.x - a.x) * (i.y - a.y)) != Math.round((b.y - a.y) * (i.x - a.x))) return false
    return (Math.min(a.x, b.x) <= i.x+1 && i.x-1 <= Math.max(a.x, b.x)) || Math.min(a.y, b.y) <= i.y+1 && i.y-1 <= Math.max(a.y, b.y)
}

function isPointOnLine(a, b, i, epsilon = 10) {
    // Проверка коллинеарности с учётом погрешности
    const crossProduct = (b.x - a.x) * (i.y - a.y) - (b.y - a.y) * (i.x - a.x);
    if (Math.abs(crossProduct) > epsilon) return false;

    // Проверка, что точка лежит в пределах отрезка (с небольшим допуском для границ)
    const isBetweenX = (i.x >= Math.min(a.x, b.x) - epsilon) &&
                      (i.x <= Math.max(a.x, b.x) + epsilon);

    const isBetweenY = (i.y >= Math.min(a.y, b.y) - epsilon) &&
                      (i.y <= Math.max(a.y, b.y) + epsilon);

    return isBetweenX && isBetweenY;
}

function isPointOnLine(a, b, i, epsilon = 1) {
    // Если отрезок вырожден в точку
    const isSinglePoint = Math.abs(a.x - b.x) < epsilon && Math.abs(a.y - b.y) < epsilon;
    if (isSinglePoint) {
        return Math.abs(i.x - a.x) < epsilon && Math.abs(i.y - a.y) < epsilon;
    }

    // Параметрическое представление: i = a + t*(b - a)
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    // Вычисляем параметр t для координат x и y
    let tx = (Math.abs(dx) > epsilon) ? (i.x - a.x) / dx : 0;
    let ty = (Math.abs(dy) > epsilon) ? (i.y - a.y) / dy : 0;

    // Если отрезок вертикальный или горизонтальный, используем другую координату
    if (Math.abs(dx) < epsilon) tx = ty;
    if (Math.abs(dy) < epsilon) ty = tx;

    // Проверяем, что t одинаков для x и y (коллинеарность)
    const isCollinear = Math.abs(tx - ty) < epsilon;

    // Проверяем, что t ∈ [0, 1] с учётом погрешности
    const isInBounds = tx >= -epsilon && tx <= 1 + epsilon;

    return isCollinear && isInBounds;
}*/

function isPointOnLine(a, b, i, epsilon = 1) {
    // 1. Проверка коллинеарности через векторное произведение
    const crossProduct = (b.x - a.x) * (i.y - a.y) - (b.y - a.y) * (i.x - a.x);
    if (Math.abs(crossProduct) > epsilon) return false;

    // 2. Проверка, что точка внутри расширенного bounding box отрезка
    const minX = Math.min(a.x, b.x) - epsilon;
    const maxX = Math.max(a.x, b.x) + epsilon;
    const minY = Math.min(a.y, b.y) - epsilon;
    const maxY = Math.max(a.y, b.y) + epsilon;

    const isInBoundingBox = i.x >= minX && i.x <= maxX && i.y >= minY && i.y <= maxY;

    // 3. Для почти вертикальных/горизонтальных отрезков — дополнительная проверка проекции
    const isVertical = Math.abs(b.x - a.x) < epsilon;
    const isHorizontal = Math.abs(b.y - a.y) < epsilon;

    if (isVertical) {
        // Вертикальный отрезок: проверяем y-координату
        return isInBoundingBox && Math.abs(i.x - a.x) <= epsilon;
    }
    if (isHorizontal) {
        // Горизонтальный отрезок: проверяем x-координату
        return isInBoundingBox && Math.abs(i.y - a.y) <= epsilon;
    }

    return isInBoundingBox;
}

function windowToCanvas(cnvs, x, y) {
    let bbox = cnvs.getBoundingClientRect();
    return { x: x - bbox.left * (cnvs.width / bbox.width),
        y: y - bbox.top * (cnvs.height / bbox.height)
    };
}


class HSLColorPicker{
    constructor(canvas, colorPickerInput){
        this.colorPickerCanvas = canvas
        this.colorPickerInput = colorPickerInput
        this.colorPickerCtx = this.colorPickerCanvas.getContext('2d', {
            willReadFrequently: true
        })
        this.colorPickerCtx.globalAlpha = 1.0; // Полная непрозрачность
        this.colorPickerCtx.globalCompositeOperation = "source-over";
        this.pickerPos = new Vector(128, 128)
        this.huePickerPos = 0
        this.colorPickerLeftPressed = false
        this.dragPicker = false
        this.dragHuePicker = false
        this.buffer1 = 0
        this.selectedColor = [0, 0, 0, 255]

        this.colorPickerCanvas.addEventListener('mouseup', (event) => {
            event.preventDefault()
            this.colorPickerLeftPressed = false
            this.lastPoint = null
            this.dragPicker = false
            this.dragHuePicker = false
        })
        this.colorPickerCanvas.addEventListener('touchend', (event) => {
            event.preventDefault()
            this.colorPickerLeftPressed = false
            this.lastPoint = null
            this.dragPicker = false
            this.dragHuePicker = false
        })

        this.colorPickerCanvas.addEventListener('mousedown', (event) => {
            event.preventDefault()
            this.colorPickerLeftPressed = event.button === 0
            this.startmove(event)
            this.mousemove(event)
        })
        this.colorPickerCanvas.addEventListener('touchstart', (event) => {
            event.preventDefault()
            this.colorPickerLeftPressed = true
            this.startmove(event.touches[0])
            this.mousemove(event.touches[0])
        })


        this.colorPickerCanvas.addEventListener('mousemove', (event) => {
            event.preventDefault()
            this.mousemove(event)
        })
        this.colorPickerCanvas.addEventListener('touchmove', (event) => {
            event.preventDefault()
            this.mousemove(event.touches[0])
        })
    }

    getTriagnleColor(pc){
        let rotatedp = toPolar(pc)
        rotatedp.y -= this.huePickerPos
        let rotateddc = toDecart(rotatedp)
        let rotatedd = new Vector(rotateddc.x+127-50, rotateddc.y+127-25)
        //return `hsl(${huePickerPos}rad, ${rotatedd.x/2.06}%, ${100-rotatedd.y/2.06}%)`
        return hslToRgb(this.huePickerPos, rotatedd.x/2.06, 100-rotatedd.y/2.06)
    }

    render(){
        this.colorPickerCanvas.width = 306
        this.colorPickerCanvas.height = 306
        let a1 = 5.759586531581287 - this.huePickerPos
        let a2 = 3.6651914291880923 - this.huePickerPos
        let a3 = 1.5707963267948966 - this.huePickerPos
        let p1 = new Vector(127+127*Math.sin(a1),127+127*Math.cos(a1))
        let p2 = new Vector(127+127*Math.sin(a2),127+127*Math.cos(a2))
        let p3 = new Vector(127+127*Math.sin(a3),127+127*Math.cos(a3))
        const imageData = this.colorPickerCtx.createImageData(306, 306);
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
                    rgb = this.getTriagnleColor(tc)
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
        this.colorPickerCtx.putImageData(imageData, 0, 0);
        this.drawColorPicker()
        this.drawHuePicker()
    }

    drawColorPicker(){
        this.pickerPos = this.pickerPos.round()
        this.buffer1 = this.colorPickerCtx.getImageData(this.pickerPos.x-12, this.pickerPos.y-12, this.pickerPos.x+12, this.pickerPos.y+12);
        this.colorPickerCtx.beginPath();
        this.colorPickerCtx.arc(this.pickerPos.x, this.pickerPos.y, 7.5, 0, 2 * Math.PI);
        let rgb = this.getTriagnleColor(new Vector(this.pickerPos.x-25-127, this.pickerPos.y-25-127));
        this.colorPickerCtx.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
        //selectedColor = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
        this.selectedColor = [rgb[0], rgb[1], rgb[2], 255]
        this.colorPickerInput.value = ('#'+rgb[0].toString(16)+rgb[1].toString(16)+rgb[2].toString(16)+'FF').toUpperCase()
        this.colorPickerCtx.fill();
        this.colorPickerCtx.lineWidth = 4;
        this.colorPickerCtx.strokeStyle = "white";
        this.colorPickerCtx.stroke();
    }

    drawHuePicker(){
        this.colorPickerCtx.beginPath();
        this.colorPickerCtx.arc(153, 153, 153-2, (this.huePickerPos-0.06)%(2*Math.PI), (this.huePickerPos+0.06)%(2*Math.PI));
        let p = toDecart(new Vector(153-2, (this.huePickerPos-0.06)%(2*Math.PI)))
        p.x += 153; p.y += 153
        this.colorPickerCtx.lineTo(p.x, p.y);
        this.colorPickerCtx.arc(153, 153, 127, (this.huePickerPos-0.06)%(2*Math.PI), (this.huePickerPos+0.06)%(2*Math.PI));
        p = toDecart(new Vector(153-2, (this.huePickerPos+0.06)%(2*Math.PI)))
        p.x += 153; p.y += 153
        this.colorPickerCtx.lineTo(p.x, p.y);
        this.colorPickerCtx.lineWidth = 4;
        this.colorPickerCtx.strokeStyle = "white";
        this.colorPickerCtx.fillStyle = `hsl(${this.huePickerPos}rad, 100%, 50%)`
        this.colorPickerCtx.fill()
        this.colorPickerCtx.stroke()
    }

    startmove(event){
        let pos = windowToCanvas(this.colorPickerCanvas, event.clientX, event.clientY)
        if(distance(pos, this.pickerPos) <= 11.5) {
            this.dragPicker = true
        }
        let tc = new Vector(pos.x-25-127, pos.y-25-127)
        let rt = toPolar(tc)
        if(rt.x > 127 && rt.x < 153){
            this.dragHuePicker = true
        }
    }

    mousemove(event){
        let pos = windowToCanvas(this.colorPickerCanvas, event.clientX, event.clientY)
        let polarPos = toPolar(new Vector(pos.x-153, pos.y-153))
        if(this.colorPickerLeftPressed){
            if(!this.dragHuePicker) {
                let a1 = 5.759586531581287 - this.huePickerPos
                let a2 = 3.6651914291880923 - this.huePickerPos
                let a3 = 1.5707963267948966 - this.huePickerPos
                let p1 = new Vector(127 + 25 + 127 * Math.sin(a1), 127 + 25 + 127 * Math.cos(a1))
                let p2 = new Vector(127 + 25 + 127 * Math.sin(a2), 127 + 25 + 127 * Math.cos(a2))
                let p3 = new Vector(127 + 25 + 127 * Math.sin(a3), 127 + 25 + 127 * Math.cos(a3))
                if (pos.y * (p2.x - p1.x) > (p2.y - p1.y) * (pos.x - p2.x) + p2.y * (p2.x - p1.x) &&
                    pos.y * (p3.x - p2.x) > (p3.y - p2.y) * (pos.x - p3.x) + p3.y * (p3.x - p2.x) &&
                    pos.y * (p3.x - p1.x) < (p3.y - p1.y) * (pos.x - p1.x) + p1.y * (p3.x - p1.x)
                ) {
                    if (this.buffer1 !== 0) {
                        this.colorPickerCtx.putImageData(this.buffer1, this.pickerPos.x - 12, this.pickerPos.y - 12);
                    }
                    this.pickerPos = new Vector(pos.x, pos.y)
                    this.drawColorPicker()
                }else{
                    if (this.buffer1 !== 0) {
                        this.colorPickerCtx.putImageData(this.buffer1, this.pickerPos.x - 12, this.pickerPos.y - 12);
                    }
                    let dp1 = distance(p1, pos)
                    let dp2 = distance(p2, pos)
                    let dp3 = distance(p3, pos)
                    console.log(['dp', dp1, dp2, dp3])
                    if(dp1 < dp2 && dp1 < dp3) this.pickerPos = p1
                    if(dp2 < dp1 && dp2 < dp3) this.pickerPos = p2
                    if(dp3 < dp1 && dp3 < dp2) this.pickerPos = p3
                    let pp1 = nearestPointToLine(p1, p2, pos)
                    let pp2 = nearestPointToLine(p1, p3, pos)
                    let pp3 = nearestPointToLine(p2, p3, pos)
                    /*colorPickerCtx.strokeStyle='red'
                    colorPickerCtx.beginPath()
                    colorPickerCtx.arc(pp1.x, pp1.y, 3, 0, 2*Math.PI)
                    colorPickerCtx.stroke()*/
                    console.log(['pp', pp1, pp2, pp3])
                    let dpp1 = distance(pp1, pos)
                    let dpp2 = distance(pp2, pos)
                    let dpp3 = distance(pp3, pos)
                    console.log(['dpp', dpp1, dpp2, dpp3])
                    if(dpp1 < dpp2 && dpp1 < dpp3 && isPointOnLine(p1, p2, pp1)) this.pickerPos = pp1
                    if(dpp2 < dpp1 && dpp2 < dpp3 && isPointOnLine(p1, p3, pp2)) this.pickerPos = pp2
                    if(dpp3 < dpp1 && dpp3 < dpp2 && isPointOnLine(p2, p3, pp3)) this.pickerPos = pp3
                    console.log(['pickerpos', this.pickerPos])
                    this.pickerPos = this.pickerPos.round()
                    this.drawColorPicker()
                    console.log(isPointOnLine(p1, p3, pp2))
                }
            }else if(this.dragHuePicker){
                let delta = polarPos.y - this.huePickerPos
                this.huePickerPos = polarPos.y
                let pickerPosPolar = toPolar(new Vector(this.pickerPos.x-153, this.pickerPos.y-153))
                pickerPosPolar.y += delta
                this.pickerPos = toDecart(pickerPosPolar)
                this.pickerPos.x += 153
                this.pickerPos.y += 153
                this.render()
            }
        }
    }

    getColorRGB(){
        return [...this.getTriagnleColor(new Vector(this.pickerPos.x-25-127, this.pickerPos.y-25-127)), 255]
    }
}
