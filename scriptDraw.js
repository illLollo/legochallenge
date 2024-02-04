const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d', { willReadFrequently: true })

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
    #startCoords = { x : 0, y : 0 }
    #drawable = false
    #linecolor = "#000000"
    #linewidth = 1
    #linecap = 'round'
    #image = null
    #penmode = true
    #radius = 1
    #animationFrame = null
    #isSwirlActive = false
    #isRainActive = false
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
    getStartCoords() { return this.#startCoords }
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
        if(this.#isRainActive)
            return

        if (!this.#isSwirlActive)
        {
            window.cancelAnimationFrame(drawProps.getAnimationFrame())
            drawProps.setAnimationFrame(null)
    
            fxCanvas.draw(fxCanvas.texture(bufferCanvas))
    
            this.#isSwirlActive = true
            
        }
        else
        {
            drawProps.setAnimationFrame(window.requestAnimationFrame(render))
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
.then(async (model) => {

    const animate = async () =>
    {
        const preds = await model.detect(video)
        
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
                    let [ angleX, angleY, boxWidth, boxHeight ] = detections.bbox
                    
                    angleX = angleX * (canvas.width / 500)
                    angleY = angleY * (canvas.height / 500)

                    drawProps.getCoords().x = angleX + boxWidth / 2
                    drawProps.getCoords().y = angleY + boxHeight / 2
                    

                    const result = checkPinching(preds)

                    if (result && result !== drawProps.isDrawable()) //result TRUE ma prima era FALSE
                    {
                      drawProps.getStartCoords().x = drawProps.getCoords().x
                      drawProps.getStartCoords().y = drawProps.getCoords().y
                    }

                    if (!result && result !== drawProps.isDrawable()) //result FALSE ma prima era TRUE
                    {
                      context.beginPath()
                    }

                    drawProps.setDrawable(result)

                    if (drawProps.isSwirlActive())
                        drawProps.doSwirlAnimation()
                }   
            }

        window.requestAnimationFrame(animate)
        
    }
    
    const { status } = await handTrack.startVideo(video)
    if (!status)
      document.querySelector('body').innerHTML = `<h2> Impossibile avviare la videocamera, riprova o acconsenti l'utilizzo dal browser! </h2>`
    else
      animate()

})

const drawProps = new DrawProps(canvas, context)

const bufferCanvas = document.querySelector('.c2')
bufferCanvas.width = canvas.width
bufferCanvas.height = canvas.height
const bufferContext = bufferCanvas.getContext('2d', { willReadFrequently: true } )

const MULTIPLIER = 1

const fxCanvas = fx.canvas()

document.querySelector('.swirl').addEventListener('change', () =>
{
  console.log('change')
    drawProps.swirl(fxCanvas)
  })
document.querySelector('.change_color').addEventListener('change', async function () 
{
  const tempCanvas = document.createElement('canvas', { willReadFrequently : true })
  const tempContext = tempCanvas.getContext('2d')

  tempCanvas.width = canvas.width
  tempCanvas.height = canvas.height

  if (drawProps.getImage() !== null)
    tempContext.drawImage(drawProps.getImage(), 0, 0, canvas.width, canvas.height)
  
  const elaborateAll = async (divid) => 
  {
    const elaborateSlice = async (startX, endX) => 
    {
      for (let x = startX; x < endX; x++) 
          for (let y = 0; y < bufferCanvas.height; y++) 
          {
            const p = tempContext.getImageData(x, y, 1, 1).data;
            tempContext.fillStyle = invertHex("#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6));
            tempContext.fillRect(x, y, 1, 1);
          }
      }

      const sliceWidth = Math.ceil(bufferCanvas.width / divid);
      const promises = [];
    
      for (let i = 0; i < divid; i++) 
      {
        const startX = i * sliceWidth;
        const endX = startX + sliceWidth;
        promises.push(elaborateSlice(startX, endX));
      }
    
      await Promise.all(promises);
    }
    await elaborateAll(5)

    const image = new Image()
    image.src = tempCanvas.toDataURL()

    drawProps.setImage(image)

    bufferContext.drawImage(tempCanvas, 0, 0)
})

document.querySelector('input[type="file"]').addEventListener('change', async function () 
{
    console.log(this.files)

    if (this.files && this.files[0])
    {
        const freader = new FileReader()
        freader.onload = (e) => {
            
            const image = new Image()
            image.src = e.target.result

            console.log(e, image)

            image.onload = () => 
            {
              bufferContext.drawImage(image, 0, 0, bufferCanvas.width, bufferCanvas.height)
              drawProps.setImage(image)
            }
        }
        freader.readAsDataURL(this.files[0])
    }
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
      context.moveTo(drawProps.getStartCoords().x, drawProps.getStartCoords().y)
      context.lineCap = 'round'
      context.lineWidth = 3;
      context.lineTo(drawProps.getCoords().x, drawProps.getCoords().y);
      context.strokeStyle = drawProps.getLineColor();
      context.stroke();

      drawProps.getStartCoords().x = drawProps.getCoords().x
      drawProps.getStartCoords().y = drawProps.getCoords().y

      console.log(drawProps.getStartCoords(), drawProps.getCoords())

      // context.moveTo(drawProps.getCoords().x, drawProps.getCoords().y)

        // bufferContext.beginPath()
        // // bufferContext.arc(drawProps.getCoords().x, drawProps.getCoords().y, 5, 0, Math.PI * 2)
        // bufferContext.closePath()
        // bufferContext.fill()
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
    context.drawImage(bufferCanvas, 0, 0)
    
    if (drawProps.isPenActive())
    {
      drawLine() 
      bufferContext.drawImage(canvas, 0, 0, canvas.width, canvas.height)
    }
    else  
    {
      if (drawProps.getImage() !== null)
        bufferContext.drawImage(drawProps.getImage(), 0, 0, bufferCanvas.width, bufferCanvas.height)
      rubberArc()

      bufferContext.drawImage(canvas, 0, 0)
    } 
    if (drawProps.isCursorInsideCanvas())
        drawCursor()

    drawProps.setAnimationFrame(window.requestAnimationFrame(render))
}
render()

document.querySelector('.download').addEventListener('click', function () 
{    
    const a = document.createElement('a')
    a.href = canvas.toDataURL("image/jpeg", 1)
    a.download = "Immagine.png"
    a.click()
    a.remove()
})
document.querySelector('video').style.height = '400px'
const colors = document.querySelectorAll('.color')

colors.forEach((color) => {
    color.addEventListener('click', () => {
        colors.forEach((color) => color.removeAttribute('clicked'))
        color.setAttribute('clicked', 'true')

        console.log(getComputedStyle(color).backgroundColor, invertHex(getComputedStyle(color).backgroundColor))


        drawProps.setLineColor(invertHex(getComputedStyle(color).backgroundColor))
        document.querySelector('.colorpicker').value = drawProps.getLineColor()
    })
});
document.querySelector('.rubber').addEventListener('click', function () {
    if (!drawProps.isSwirlActive())
    {
      drawProps.switchMode()
      this.innerHTML = `Gomma ${drawProps.isPenActive() ? 'Off' : 'On'}`
    }
})
document.querySelector('.colorpicker').addEventListener('input', function () 
{
    drawProps.setLineColor(this.value)
    colors.forEach((color) => 
    {
      console.log(rgbCSSToHex(getComputedStyle(color).backgroundColor), this.value)
        if (rgbCSStoHex(getComputedStyle(color).backgroundColor) === this.value.toUpperCase())
        {
            colors.forEach(color => color.removeAttribute('clicked'))
            color.setAttribute('clicked', 'true')
            return
        }
    });
})
const rgbCSSToHex = (rgbString) => 
{
  const match = rgbString.match(/(\d+),\s*(\d+),\s*(\d+)/)
  if (match) 
  {
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);

    const hexColor = '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);

    return hexColor.toUpperCase(); 
  }
  return null;
}
const rgbToHex = (r, g, b) => 
{
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
}
const invertHex = (hex) =>
{
  hex = hex.slice(1)
  return '#'.concat((+(`0x1${hex}`) ^ 0xFFFFFF).toString(16).slice(1).toUpperCase())
}
