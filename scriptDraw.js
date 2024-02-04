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
        if(this.#isRainActive)
            return

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
                    let [ angleX, angleY, boxWidth, boxHeight ] = detections.bbox

                    angleX = angleX * (canvas.width / 500)
                    angleY = angleY * (canvas.height / 500)

                    drawProps.getCoords().x = angleX + boxWidth / 2
                    drawProps.getCoords().y = angleY + boxHeight / 2

                    // console.log(detections.bbox[0], detections.bbox[1], drawProps.getCoords().x, drawProps.getCoords().y)

                    if (drawProps.isSwirlActive())
                        drawProps.doSwirlAnimation()
                    // if (drawProps.isRainActive())
                    //     drawProps.doRainAnimation()

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

const bufferCanvas = document.createElement('canvas')
bufferCanvas.width = canvas.width
bufferCanvas.height = canvas.height
const bufferContext = bufferCanvas.getContext('2d', { willReadFrequently: true } )

const MULTIPLIER = 1

const fxCanvas = fx.canvas()

// const inputs = document.querySelectorAll('input[type="checkbox"]')
// inputs.forEach((input) => 
// {
//     input.addEventListener('change', function () 
//     {
//         if (this.checked)
//         {
//           inputs.forEach((inp) => 
//           {
//             if (inp.checked && input !== inp)
//               inp.click()
//           })
//         }

//     })
// });
document.querySelector('.swirl').addEventListener('change', () =>
{
  console.log('change')
    drawProps.swirl(fxCanvas)
})
document.querySelector('.change_color').addEventListener('change', async function () 
{
    const elaborateAll = async (divid) => 
    {
      const elaborateSlice = async (startX, endX) => 
      {
        for (let x = startX; x < endX; x++) 
          for (let y = 0; y < bufferCanvas.height; y++) 
          {
            const p = bufferContext.getImageData(x, y, 1, 1).data;
            bufferContext.fillStyle = invertHex("#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6));
            bufferContext.fillRect(x, y, 1, 1);
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
    drawProps.setImage(new Image(bufferCanvas.toDataURL()))
    // context.drawImage(bufferCanvas, 0, 0)
    // console.log("START: " + Math.round((bufferCanvas.width / 4) * i) + " END: " + Math.round((width / 4) * i))

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

    // console.log(drawProps.getImage()?.src)
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
        context.drawImage(drawProps.getImage(), 0, 0, bufferCanvas.width, bufferCanvas.height)

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
