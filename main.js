let body = document.body
let drawCtx = document.getElementById('drawing').getContext('2d')
let imgCtx = document.getElementById('image').getContext('2d')
let lastImg

let processImg = (img, ctx, prams) => {
  //is there a cleaner way to do this?
  let zip = (a1,a2,fn) => a1.map((val,i) => fn(val,a2[i]))

  let imgSize = [img.width,img.height]
  let canSize = [ctx.canvas.width,ctx.canvas.height]

  let sizes = zip(imgSize,canSize,Array.of)
  let scaleF = sizes.map(e => e[0]/e[1]).reduce((a,b) => Math.min(a,b))
  let scaledDims = imgSize.map(e => e/scaleF)
  let imgPos = zip(scaledDims,canSize,(a,b)=>-(a-b)/2)
  //end this 

  ctx.drawImage(img,0,0,...imgSize,...imgPos,...scaledDims)

  drawSpiral(drawCtx, imgCtx, prams)
}

let drawSpiral = (drawCtx, imgCtx, prams) => {
  let a = 1*2
  let b = 2
  let centerx = drawCtx.canvas.width / 2
  let centery = drawCtx.canvas.height / 2
  //being spiraling :)
  drawCtx.clearRect(0, 0, drawCtx.canvas.width, drawCtx.canvas.height)

  drawCtx.moveTo(centerx, centery)
  let [lastx,lasty] = [centerx,centery]
  for (i = 0; i < 19000; i++) {
    let angle = 0.015 * i
    let x = centerx + (a + b * angle) * Math.cos(angle) + Math.random()
    let y = centery + (a + b * angle) * Math.sin(angle) + Math.random()

    drawCtx.beginPath()
    drawCtx.moveTo(lastx, lasty)
    drawCtx.strokeStyle = "#000"

    let pxl = imgCtx.getImageData(x/2, y/2, 1, 1).data.slice(0,3)
    let pxlB = 255 - pxl.reduce((a,b) => a+b)/3

    drawCtx.lineWidth = 0.6+pxlB/32
    drawCtx.lineTo(x, y)
    drawCtx.stroke()
    ;[lastx,lasty] = [x,y]
  }
}

let preventDefault = event => {
  event.preventDefault()
}

let handleDrop = event => {
  event.preventDefault()
  let reader = new window.FileReader()
  reader.onload = event => {
    let img = new Image
    img.src = event.target.result;
    lastImg = img
    img.onload = () => processImg(img,imgCtx,{})
  }
  let file = event.dataTransfer.files[0]
  reader.readAsDataURL(file)
}

window.addEventListener('drop', preventDefault)
window.addEventListener('dragover', preventDefault)
body.addEventListener('drop', handleDrop)


