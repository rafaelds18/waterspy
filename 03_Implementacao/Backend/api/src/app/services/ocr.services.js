var Jimp = require("jimp");
var fs = require('fs');
const { createWorker } = require('tesseract.js');
      
exports.readConsumption = async function(area, img){
    await saveImage(area, img);
    let consumption = await recognizeImg('img-opt.jpg').then(function(consumption){
        consumption = consumption.replace(/ /g,'');

        return consumption;
    });
    return consumption;
}

async function saveImage(area, img) {
    let kernel = [
        [0.0625, 0.0625, 0.0625],
        [0.0625, 0.0625, 0.0625], 
        [0.0625, 0.0625, 0.0625]];

    let kernel2 = [
        [0, -1, 0],
        [-1, 5, -1], 
        [0, -1, 0]
    ];

    let kernels ={
        emboss_kernel: [
            [-2, -1, 0], 
            [-1, 1, 1], 
            [0, 1, 2]],
        edgedetect_kernel: [
            [0, 1, 0], 
            [1, -4, 1], 
            [0, 1, 0]],
        edgeenhance_kernel: [
            [0, 0, 0], 
            [-1, 1, 0], 
            [0, 0, 0]],
        blur_kernel: [
            [0.0625, 0.125, 0.0625],
            [0.125, 0.25, 0.125], 
            [0.0625, 0.125, 0.0625]],
        sharpen_kernel: [
            [0,-1,0], 
            [-1,5,-1], 
            [0,-1,0]],
        costum_kernel: [
            [0,-0.5,0], 
            [-0.5,3,-0.5], 
            [0,-0.5,0]],
        costum_kernel2: [
            [0,-0.5,0], 
            [-0.5,1,-0.5], 
            [0,-0.5,0]],
    };
        await Jimp.read(img).then(function (image) {
            image
                .normalize()
                .greyscale()
                .contrast(1)
                .invert()
                .convolute(kernel)
                .write("img-opt.jpg");
        }).catch(function (err) {
            console.error(err);
        });
}

async function recognizeImg(image){
    const worker = createWorker({
        logger: m => console.log("[OCR] '" + image + "' : ",m["progress"]*100 + "%")
      });   
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.setParameters({
        tessedit_char_whitelist: '0123456789',
        preserve_interword_spaces: '0',
        tessedit_ocr_engine_mode:'OEM_LSTM_ONLY'
    });
    const { data: { text } } = await worker.recognize(image)
    await worker.terminate();
    return text;
    
}

// Assuming that 'path/file.txt' is a regular file.
exports.removeFile = function(path){
    fs.unlink(path, (err) => {
    if (err) throw err;
    });
}
