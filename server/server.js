var express = require("express");
var qrcode = require('express-qrcode');
var app = express();
var port = process.env.PORT || 3000


app.use('/', express.static("./Entwicklung"));
app.use(qrcode);

/* GET home page. */
app.get('/share/code', function(req, res) {

  var video= req.param("video");
  var start= req.param("start");
  var ziel = req.param("ziel");
  var fullUrl = req.get('Host') + "?video=" + video + "&start" + start + "&ziel=" + ziel;
  var qrcode = req.qrcode();
  qrcode.setDimension(120,120);
  qrcode.setCharset('UTF-8');
  qrcode.setCharset('UTF-8');
  qrcode.setCorrectionLevel('L',0);
  console.log(fullUrl);
  qrcode.setData(fullUrl);
  var image = qrcode.getImage();
  res.send({img: image});
});


app.listen(port, function () {
  console.log('Example app listening on port '+port+'!');
});