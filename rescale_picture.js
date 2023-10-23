const { createCanvas, Image } = require('canvas');

async function ScaleImage(pValue, filetype="image/jpeg"){
    // console.log(pValue)
    var img = new Image(); //document.createElement("img");
    img.onload = (event)=>{
        // Dynamically create a canvas element
        var canvas = createCanvas(512, 512);

        // var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");

        // canvas.width = 512;
        // canvas.height = 512;

        // Actual resizing
        //https://stackoverflow.com/questions/23104582/scaling-an-image-to-fit-on-canvas
        var hRatio = canvas.width/img.width;
        var vRatio = canvas.height/img.height;
        var ratio  = Math.max ( hRatio, vRatio );
        var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
        var centerShift_y = ( canvas.height - img.height*ratio ) / 2;

        ctx.drawImage(img, 0, 0, img.width, img.height,
            centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);
            
        var dataURI = canvas.toDataURL(filetype);
        
        return ({data:dataURI, type:filetype})
        // this.upload_image({data:dataURI, type:filetype})
        
    }
    img.setAttribute('crossorigin', 'anonymous');
    img.crossOrigin = "anonymous";
    img.src = pValue;
}


module.exports = ScaleImage;