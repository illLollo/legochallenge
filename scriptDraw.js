const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = window.innerWidth - window.scrollX
canvas.height = window.innerHeight - window.scrollY

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth - window.scrollX
    canvas.height = window.innerHeight - window.scrollY
})

class DrawProps
{
    constructor(canvas, context)
    {
        this.#context = context
        this.#canvas = canvas
    }
    #context = null
    #canvas = null
    #coords = { x : 0, y : 0 }
    #drawable = false
    #linecolor = "#000000"
    #linewidth = 1
    #linecap = 'round'
    #image = null
    #penmode = true
    #radius = 1
    #animationFrame = null
    #isSwirlActive = false
    #swirlAnimation = () => {
        fxCanvas.draw(fxCanvas.texture(bufferCanvas))
        fxCanvas.swirl(drawProps.getCoords().x, drawProps.getCoords().y, 100, 3).update()
        
        context.clearRect(0, 0, canvas.width, canvas.height)
    
        context.drawImage(fxCanvas, 0, 0)
        if (drawProps.isCursorInsideCanvas())
            drawCursor()
    }
    setLineWidth(value)
    {
        this.#linewidth = value
        this.#context.lineWidth = this.#linewidth
    }
    setLineColor(value)
    {
        this.#linecolor = value
        this.#context.fillStyle = this.#linecolor
        this.#context.strokeStyle = this.#linecolor
    }
    setDrawable(value)
    {
        this.#drawable = value
    }
    setCoords(value)
    {
        this.#coords = value
    }
    // setPrevCoords(value)
    // {
    //     this.#prevcoords = value
    // }
    setLineCap(value)
    {
        this.#linecap = value
        this.#context.lineCap = this.#linecap
    }
    setImage(value)
    {
        this.#image = value
    }
    getLineWidth() { return this.#linewidth }
    getLineColor() { return this.#linecolor }
    isDrawable() { return this.#drawable }
    getCoords() { return this.#coords }
    // getPrevCoords() { return this.#prevCoords }
    getLineCap() { return this.#linecap }
    getImage() { return this.#image }
    getRadius() { return this.#radius }
    getAnimationFrame () { return this.#animationFrame }
    isSwirlActive() { return this.#isSwirlActive }
    isCursorInsideCanvas()
    {
        return this.#coords.x >  0 && this.#coords.x < this.#canvas.width && this.#coords.y > 0 && this.#coords.y < this.#canvas.height
    }
    isPenActive()
    {
        return this.#penmode
    }
    switchMode()
    {
        this.#penmode = !this.#penmode
    }
    setRadius(value)
    {
        this.#radius = value
    }
    setAnimationFrame(value)
    {
        this.#animationFrame = value
    }
    swirl(fxCanvas)
    {

        if (!this.#isSwirlActive)
        {
            window.cancelAnimationFrame(drawProps.getAnimationFrame())
            drawProps.setAnimationFrame(null)
    
            fxCanvas.draw(fxCanvas.texture(bufferCanvas))
    
            // window.addEventListener('mousemove', this.#swirlAnimation)
            this.#isSwirlActive = true
            
        }
        else
        {
            // window.removeEventListener('mousemove', this.#swirlAnimation)
            window.requestAnimationFrame(render)
            this.#isSwirlActive = false
        }
    }
    doSwirlAnimation()
    {
        if (this.#isSwirlActive)
            this.#swirlAnimation()
    }
 

}
const checkPinching = (preds) => {
    
    for (const pred of preds)
        if (pred.label === 'pinch')
            return true
    return false
}
const video = document.querySelector('video')
handTrack.load({ scoreTreshold: 0.41, flipHorizontal: true })
.then((model) => {

    const animate = async () =>
    {
        const preds = await model.detect(video)
        
            drawProps.setDrawable(checkPinching(preds))
            if (preds.length > 0)
            {

                const detections = preds.reduce((prev, current) => 
                {
                    if (current.label !== 'open')
                        return prev
                    if (prev === null)
                        return current

                    return prev.score > current.score ? prev : current

                }, null)
                if (detections !== null)
                {
                    const [ angleX, angleY, boxWidth, boxHeight ] = detections.bbox

                    drawProps.getCoords().x = angleX + boxWidth / 2 + canvas.offsetLeft / 2
                    drawProps.getCoords().y = angleY + boxHeight / 2

                    console.log(drawProps.getCoords())

                    drawProps.doSwirlAnimation()

                }
                

                
            }

        window.requestAnimationFrame(animate)
        
    }
    
    handTrack.startVideo(video)
    .then((value) => {
        animate()        
    })
})
const drawProps = new DrawProps(canvas, context)

const bufferCanvas = document.createElement('canvas')
bufferCanvas.width = canvas.width
bufferCanvas.height = canvas.height
const bufferContext = bufferCanvas.getContext('2d')

const MULTIPLIER = 1

const fxCanvas = fx.canvas()


document.querySelector('.swirl').addEventListener('input', () =>
{
    drawProps.swirl(fxCanvas)
})

document.querySelector('.load').addEventListener('click', async function () 
{
    const image = new Image()
    image.src = document.querySelector('input[type="text"]').value
    
    image.onload = () => 
    {
        // canvas.width = (image.width * MULTIPLIER)  % window.innerWidth
        // canvas.height = (image.height * MULTIPLIER) % window.innerHeight
        // canvas.width = (image.width * MULTIPLIER)  % window.innerWidth
        // canvas.height = (image.height * MULTIPLIER) % window.innerHeight
        drawProps.setImage(image)
    }
    
})
canvas.addEventListener('mouseenter', (e) => 
{
    // drawProps.x = e.clientX - canvas.offsetLeft
    // drawProps.y = e.clientY - canvas.offsetTop
    
    // document.body.style.cursor = 'none'
})
canvas.addEventListener('mouseleave', () => {
    // document.body.style.cursor = 'default'
})

// canvas.addEventListener('mousedown', (e) => 
// {
//     drawProps.setDrawable(true)
// })
// canvas.addEventListener('mouseup', () => drawProps.setDrawable(false)) 
window.addEventListener('mousemove', (e) => 
{
//     drawProps.getCoords().x = e.clientX - canvas.offsetLeft
//     drawProps.getCoords().y = e.clientY - canvas.offsetTop

    // console.log(drawProps.getCoords())
})

drawProps.setRadius(10)

const drawCursor = () => 
{
    context.beginPath()
    context.fillStyle = drawProps.isPenActive() ? drawProps.getLineColor() : drawProps.isPenActive() ? drawProps.getLineColor() : 'white'
    context.arc(drawProps.getCoords().x, drawProps.getCoords().y, drawProps.isDrawable() ? drawProps.getRadius() : drawProps.getRadius() * 1.5, 0, Math.PI * 2)
    context.stroke()
    context.closePath()
    context.fill()
}
const drawLine = () =>
{

    if (drawProps.isDrawable())
    {
        context.beginPath()
        context.arc(drawProps.getCoords().x, drawProps.getCoords().y, 5, 0, Math.PI * 2)
        context.closePath()
        context.fill()
    }
    
}
const rubberArc = () => 
{
    if (drawProps.isDrawable())
    {
        context.clearRect(drawProps.getCoords().x - drawProps.getRadius(), drawProps.getCoords().y - drawProps.getRadius(), drawProps.getRadius() * 2, drawProps.getRadius() * 2)
        bufferContext.clearRect(drawProps.getCoords().x - drawProps.getRadius(), drawProps.getCoords().y - drawProps.getRadius(), drawProps.getRadius() * 2, drawProps.getRadius() * 2)
    }
}
const render = () => 
{
    context.clearRect(0, 0, canvas.width, canvas.height)
    
    if (drawProps.getImage() !== null)
        context.drawImage(drawProps.getImage(), 0, 0, canvas.width, canvas.height)

    context.drawImage(bufferCanvas, 0, 0)
    
    if (drawProps.isPenActive())
        drawLine()
    else
        rubberArc()
    

    bufferContext.drawImage(canvas, 0, 0, canvas.width, canvas.height)
    
    if (drawProps.isCursorInsideCanvas())
        drawCursor()

    drawProps.setAnimationFrame(window.requestAnimationFrame(render))
}
render()

document.querySelector('.download').addEventListener('click', function () 
{    
    const a =  document.createElement('a')
    a.href = canvas.toDataURL("image/jpeg", 1)
    a.download = "Immagine.png"
    a.click()
    a.remove()
})
const colors = document.querySelectorAll('.color')

colors.forEach((color) => {
    color.addEventListener('click', () => {
        colors.forEach((color) => color.removeAttribute('clicked'))
        color.setAttribute('clicked', 'true')

        drawProps.setLineColor(rgbToHex(getComputedStyle(color).backgroundColor))
        document.querySelector('.colorpicker').value = drawProps.getLineColor()
    })
});
document.querySelector('.rubber').addEventListener('click', () => {
    if (!drawProps.isSwirlActive())
            drawProps.switchMode()
})
document.querySelector('.colorpicker').addEventListener('input', function () 
{
    drawProps.setLineColor(this.value)
    colors.forEach((color) => 
    {
        if (rgbToHex(getComputedStyle(color).backgroundColor) == this.value)
        {
            colors.forEach(color => color.removeAttribute('clicked'))
            color.setAttribute('clicked', 'true')
            return
        }
    });
})
const rgbToHex = (rgb) => 
{
    const rgbArray = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" + ("0" + parseInt(rgbArray[1], 10).toString(16)).slice(-2) +
                        ("0" + parseInt(rgbArray[2], 10).toString(16)).slice(-2) +
                        ("0" + parseInt(rgbArray[3], 10).toString(16)).slice(-2);

}
