// const swcanvas = fx.canvas()
// const image = document.querySelector('img')

// const listenerFunction = () => {
//     swcanvas.draw(swcanvas.texture(bufferCanvas))
//     console.log(image.getBoundingClientRect())
//     swcanvas.swirl(drawProps.getCoords().x, drawProps.getCoords().y, 100, 3).update()

//     context.drawImage(swcanvas, 0, 0)
//     console.log()
// }


// document.querySelector('.swirl').addEventListener('input', function () 
// {
//     if (this.checked)
//     {
//         // canvas.style.display = 'none'

//         swcanvas.draw(swcanvas.texture(bufferCanvas))

//         window.addEventListener('mousemove', listenerFunction)
//         swcanvas.swirl(drawProps.getCoords().x, drawProps.getCoords().y, 100, 3).update()
        
//         // image.src = swcanvas.toDataURL('image/png')      
//         // image.style.display = 'flex'
//     }
//     else
//     {
//         // canvas.style.display = 'flex'
//         image.style.display = 'none'
//         window.removeEventListener('mousemove', listenerFunction)
//     }
// })
handTrack.load({ scoreTreshold: 0.41 })
.then((model) => {

    const animate = async () =>
    {
        const preds = await model.detect(document.querySelector('video'))
        
        console.log(preds[0]?.label, preds[0]?.bbox) 
    
        window.requestAnimationFrame(animate)
    
    }

    handTrack.startVideo(document.querySelector('video'))
    .then((value) => {
        animate()
        
    })
})







