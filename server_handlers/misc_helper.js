const fs = require('fs');


function writeAllBase64ImagesLog(itemId,clientId,body){
    const imgs = body.images;
    const exts = body.extensions;
    //save images to files
    const logPath = `./assets/logImages/${itemId}_${clientId}_${Date.now()}`;
    for(let i = 0; i < imgs.length; i++){
        writeBase64ToFile(imgs[i],logPath,i+"."+exts[i]);
    }
    return {logPath,extensions:exts};
}

function writeBase64ToFile(b64Data,path,fileName){
    if (!fs.existsSync(path)){
        fs.mkdirSync(path);
    }
    fileName = path + "/" + fileName;
    console.log('writeBase64ToFile',fileName)
    const buff = new Buffer(b64Data, 'base64');
    fs.writeFileSync(fileName, buff);
}

module.exports = {writeBase64ToFile,writeAllBase64ImagesLog}