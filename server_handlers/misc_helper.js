const fs = require('fs');


function writeBase64ToFile(b64Data,path,fileName){
    if (!fs.existsSync(path)){
        fs.mkdirSync(path);
    }
    fileName = path + "/" + fileName;
    console.log('writeBase64ToFile',fileName)
    const buff = new Buffer(b64Data, 'base64');
    fs.writeFileSync(fileName, buff);
}

module.exports = {writeBase64ToFile}