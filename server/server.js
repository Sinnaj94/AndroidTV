var express = require("express");
var qr = require('qr-image');
var app = express();
var port = process.env.PORT || 3000


app.use('/', express.static("./Entwicklung"));

/* GET home page. */
app.get('/share/code', function(req, res) {

  var video= req.param("video");
  var start= req.param("start");
  var ziel = req.param("ziel");
  var fullUrl = req.get('Host') + "?start" + start + "&ziel=" + ziel;
  var code = qr.image(fullUrl, { type: 'svg' });
  res.type('svg');
  code.pipe(res);
});


app.listen(port, function () {
  console.log('Example app listening on port '+port+'!');
});