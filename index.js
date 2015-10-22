var express = require('express');
var app = module.exports = express();
//app.use(app.router);
app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
// Set our default template engine to "jade"
// which prevents the need for extensions
// (although you can still mix and match)
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));


app.get('/', function (req, res) {
  res.render('index');
});


app.listen(app.get('port'), function () {
  console.log('up and running...');
});
