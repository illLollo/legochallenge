const canvas = document.querySelector('canvas')
const contex = canvas.getContext('2d')

canvas.width = window.innerWidth / 2
canvas.height = window.innerHeight / 2

const coords = { x : 0, y : 0, drawable: false }

const MULTIPLIER = 5

document.querySelector('.load').addEventListener('click', async function () 
{
    const image = new Image()
    image.src = new URL(await document.querySelector('input[type="text"]').value)

    
    canvas.width = image.width * MULTIPLIER
    canvas.height = image.height * MULTIPLIER

    contex.drawImage(image, 0, 0, canvas.width, canvas.height)

})
canvas.addEventListener('mouseenter', (e) => 
{
    coords.x = e.clientX - canvas.offsetLeft
    coords.y = e.clientY - canvas.offsetTop
})

canvas.addEventListener('mousedown', () => coords.drawable = true)
canvas.addEventListener('mouseup', () => coords.drawable = false)

canvas.addEventListener('mousemove', function (e) 
{
    contex.beginPath()
    contex.lineWidth = 1
    contex.lineCap = 'round'
    contex.strokeStyle = '#000000'
    contex.moveTo(coords.x, coords.y)

    coords.x = e.clientX - canvas.offsetLeft
    coords.y = e.clientY - canvas.offsetTop

    contex.lineTo(coords.x, coords.y)
    contex.closePath()
    if (coords.drawable)
        contex.stroke()
})
document.querySelector('.download').addEventListener('click', function () {
    
    const a =  document.createElement('a')
    a.href = canvas.toDataURL("image/jpeg", 1.0)
    a.download = "Immagine.png"
    a.click()
    a.remove()
})
