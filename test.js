var request = require('request');
var cheerio = require("cheerio");

request.post(
    'https://get-ofz-json-from-qr.enzolab.ru/',
    { form: {qr:'t=20180712T2035&s=471.90&fn=8712000100150726&i=111766&fp=2067238869&n=1'}},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body),
            checkData = JSON.parse($("#myTextArea").text());

            console.log(checkData.document.receipt.items);
        }
    }
);