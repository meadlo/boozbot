const jsQR = require("jsqr");
var jpeg = require('jpeg-js');
var fs = require('fs');

// var jpegData = fs.readFileSync('/home/zhusmansan/Desktop/photo_2018-07-12_21-09-42.jpg');
var jpegData = fs.readFileSync('/home/zhusmansan/Desktop/photo_2018-07-12_21-08-44.jpg');
// var jpegData = fs.readFileSync('/home/zhusmansan/Desktop/photo_2018-07-12_21-33-53.jpg');
var rawImageData = jpeg.decode(jpegData,true);
// console.log(rawImageData);

const code = jsQR(rawImageData.data, rawImageData.width, rawImageData.height);
console.log("Found QR code", code);
// if (code) {
  
// }