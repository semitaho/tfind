var express = require('express'),
  browserify = require('browserify'),
  stylus = require('stylus'),
  nib = require('nib'),
  React = require('react'),
  options = {};
require("babel-core").transform("code", options);
var app = module.exports = express();
var JSX = require('node-jsx').install();

var tfindApp = require(__dirname + '/components/tFindApp.jsx');
var AppFactory = React.createFactory(tfindApp);

//app.use(app.router);
app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
// Set our default template engine to "jade"
// which prevents the need for extensions
// (although you can still mix and match)
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));
app.use(stylus.middleware(
  {
    src: __dirname + '/stylus',
    dest: __dirname + '/public/css',
    compile: function (str, path) {
      return stylus(str)
        .set('filename', path)
        .use(nib());
    }
  }
))

app.get('/', function (req, res) {
  var reactHtml = React.renderToString(AppFactory({}));
  console.log('html', reactHtml);

  res.render('index', {reactOutput: reactHtml});
});


app.listen(app.get('port'), function () {
  console.log('up and running...');
});
