var fs = require('fs');
var QrCode = require('qrcode-reader');
const http = require('http');
var request = require('request');
var cheerio = require("cheerio");

var Jimp = require("jimp");
//var fn = ('/home/zhusmansan/Desktop/photo_2018-07-12_21-08-44.jpg');
// var fn = ('/home/zhusmansan/Desktop/photo_2018-07-12_21-33-53.jpg');
// var fn = ('/home/zhusmansan/Desktop/photo_2018-07-12_21-09-42.jpg');


function getQRdetails(filename) {
    var buffer = fs.readFileSync(filename);
    return new Promise(function (resolve, reject) {
        Jimp.read(buffer, function (err, image) {
            if (err) {
                console.error(err);
                // TODO handle error
                reject(new Error("Failed to read file" + err));
            }
            var qr = new QrCode();
            qr.callback = function (err, value) {
                if (err) {
                    console.error(err);
                    reject(new Error("Failed to read QR" + err));
                } else {
                    request.post(
                        'https://get-ofz-json-from-qr.enzolab.ru/', {
                            form: {
                                qr: value.result
                            }
                        },
                        function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                var $ = cheerio.load(body),
                                    checkData = JSON.parse($("#myTextArea").text());
                                var items=checkData.document.receipt.items;
                                var itemsStr = items.reduce(function (acc,cv){
                                    acc += ''+(cv.sum/100)+': '+cv.name+'\n';
                                    return acc;
                                },'')
                                resolve(itemsStr);

                                // console.log(checkData.document.receipt.items);
                            } else {
                                reject(new Error("Failed to get receipt details" + error));

                            }
                        }
                    );
                }
            };
            qr.decode(image.bitmap);
        });
    });
}


// getQRdetails(fn).then(responce => console.log(responce), error => console.log(error));

const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = 'YOUR_TG_TOKEN';
const urlTemplate = "https://api.telegram.org/file/bot"+token+"/";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
    console.log(msg);
  // send a message to the chat acknowledging receipt of their message
  
  bot.downloadFile(msg.photo[3].file_id,"/tmp").then(success=>getQRdetails(success).then(success=>bot.sendMessage(chatId, 'АчоВаще?\n'+success)));
});