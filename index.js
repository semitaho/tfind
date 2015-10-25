require('babel/register');
var React = require('react'),
  ReactDOMServer = require('react-dom/server');
express = require('express'),
  stylus = require('stylus'),
  nib = require('nib');
tfindApp = require('./components/tfindApp.jsx');
var app = module.exports = express();

//app.use(app.router);
app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
// Set our default template engine to "jade"
// which prevents the need for extensions
// (although you can still mix and match)
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  var AppFactory = React.createFactory(tfindApp);
  var reactHtml = ReactDOMServer.renderToString(AppFactory({}));
  res.render('index', {reactOutput: reactHtml});
});


app.listen(app.get('port'), function () {
  console.log('up and running...');
});
