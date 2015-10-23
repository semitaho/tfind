require('babel/register');
var React = require('react'),
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
));


app.get('/', (req, res) => {
  var AppFactory = React.createFactory(tfindApp);
  var reactHtml = React.renderToString(AppFactory({}));
  res.render('index', {reactOutput: reactHtml});
});


app.listen(app.get('port'), function () {
  console.log('up and running...');
});
