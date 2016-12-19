let body = document.body
let ctx = document.getElementById('drawing').getContext('2d');

let preventDefault = event => {
  event.preventDefault()
}

let handleDrop = event => {
  event.preventDefault()
  let reader = new window.FileReader()
  reader.onload = event => {
    var img = new Image;
    img.src = event.target.result;
    //is there a cleaner way to do this?
    let imgSize = [img.width,img.height]
    let canSize = [ctx.canvas.width,ctx.canvas.height]
    let zip = (a1,a2,fn) => a1.map((val,i) => fn(val,a2[i]))
    let sizes = zip(imgSize,canSize,Array.of)
    let scaleF = sizes.map(e => e[0]/e[1]).reduce((a,b) => Math.min(a,b))
    let scaledDims = imgSize.map(e => e/scaleF)
    let imgPos = zip(scaledDims,canSize,(a,b)=>-(a-b)/2)
    console.log(imgPos)
    //end this 

    img.onload = function() {
      ctx.drawImage(img,0,0,...imgSize,...imgPos,...scaledDims);
    }
  }
  let file = event.dataTransfer.files[0]
  reader.readAsDataURL(file)
}

window.addEventListener('drop', preventDefault)
window.addEventListener('dragover', preventDefault)
body.addEventListener('drop', handleDrop)


