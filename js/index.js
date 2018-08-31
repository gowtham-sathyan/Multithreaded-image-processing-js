
console.log('loaded');

document.getElementById("imageLoader").onchange = readImage;
var filters = ['invert', 'grayscale', 'vibrant', 'chroma'];


function generateImages(image){
    let $canvas=$('#results');
    for(let i=0;i<filters.length;i++){
        let $t=$(`<div class="col s6 center-align"><canvas id="image-${i}" class="image"></canvas></div>`);
        $canvas.append($t);
        let canvas = document.querySelector(`#image-${i}`);
        let ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image,0,0);
    }
}

function readImage() {
    if ( this.files && this.files[0] ) {
        var FR= new FileReader();
        FR.onload = function(e) {
            var img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                generateImages(img);
            };
        };
        FR.readAsDataURL( this.files[0] );
    }
}

function invertImage(ctx,canvas){
    var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var pix = imgd.data;

// Loop over each pixel and invert the color.
    for (var i = 0, n = pix.length; i < n; i += 4) {
        pix[i  ] = 255 - pix[i  ]; // red
        pix[i+1] = 255 - pix[i+1]; // green
        pix[i+2] = 255 - pix[i+2]; // blue
        // i+3 is alpha (the fourth element)
    }

// Draw the ImageData at the given (x,y) coordinates.
    ctx.putImageData(imgd, 0, 0);
}

function grayScaleImage(ctx, canvas) {
    var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var pix = imgd.data;
// Loop over each pixel and invert the color.
    for (var i = 0, n = pix.length; i < n; i += 4) {
        y = (0.3 * pix[i  ]) + (0.59 * pix[i+1]) + (0.11 * pix[i+2]);
        pix[i  ] = y; // red
        pix[i+1] = y; // green
        pix[i+2] = y; // blue
        // i+3 is alpha (the fourth element)
    }

// Draw the ImageData at the given (x,y) coordinates.
    ctx.putImageData(imgd, 0, 0);
}

function chromaImage(ctx, canvas){
    var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var pix = imgd.data;

// Loop over each pixel and invert the color.
    for (var i = 0, n = pix.length; i < n; i += 4) {
        var max;
        max = Math.max(pix[i], Math.max(pix[i+1], pix[i+2]));
        if (max === pix[i+1]) {
            pix[i  ] = 0; // red
            pix[i+1] = 0; // green
            pix[i+2] = 0;// blue
            pix[i+3] = 0;
        }
    }

// Draw the ImageData at the given (x,y) coordinates.
    ctx.putImageData(imgd, 0, 0);
}

function vibrantImage(ctx, canvas){
    var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var pix = imgd.data;

    for (var i = 0, n = pix.length; i < n; i += 4) {
        var amt, avg, bs, gs, mx, rs;
        avg = (pix[i] + pix[i+1] + pix[i+2]) / 3.0;
        mx = Math.max(pix[i], Math.max(pix[i+1], pix[i+2]));
        amt = (mx / 255 * avg / 255) * (-0.4 * 3.0);
        rs = pix[i] + (amt * (mx - pix[i]));
        gs = pix[i+1] + (amt * (mx - pix[i+1]));
        bs = pix[i+2] + (amt * (mx - pix[i+2]));
        pix[i  ] = rs; // red
        pix[i+1] = gs; // green
        pix[i+2] = bs; // blue
        // i+3 is alpha (the fourth element)
    }

// Draw the ImageData at the given (x,y) coordinates.
    ctx.putImageData(imgd, 0, 0);
}

function manipulateImage(filter,ctx,canvas) {
    switch(filter){
        case 'invert': invertImage(ctx, canvas);
                        break;
        case 'grayscale': grayScaleImage(ctx, canvas);
                        break;
        case 'chroma' : chromaImage(ctx, canvas);
                        break;
        case 'vibrant': vibrantImage(ctx, canvas);
                        break;
    }
}

function submit(){
    let start=Date.now();
    for(let i=0;i<filters.length;i++){
        let canvas = document.querySelector(`#image-${i}`);
        let ctx = canvas.getContext('2d');
        manipulateImage(filters[i],ctx,canvas);
    }
    let end=Date.now();
    let timeTaken=end-start;
    console.log('time taken - ',timeTaken);
}



