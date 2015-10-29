require('babel/register');
var React = require('react'),
  ReactDOMServer = require('react-dom/server');
express = require('express'),
  stylus = require('stylus'),
  nib = require('nib'),
  content = require('./resources/content.json'),
  tfindApp = require('./components/tfindApp.jsx'),
  lostsgrid = require('./components/lostsgrid.jsx');
nav = require('./components/navigation.jsx');
var app = module.exports = express();

var Navigation = React.createFactory(nav),
    Losts = React.createFactory(lostsgrid);
//app.use(app.router);
app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
// Set our default template engine to "jade"
// which prevents the need for extensions
// (although you can still mix and match)
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('index', {
    navigation: ReactDOMServer.renderToString(Navigation({selectedIndex: -1})),
    description: content.description,
    quotetext: content.quotetext,
    quoteauthor: content.quoteauthor
  });
});

var allMissings = require('./resources/missings.json');

app.get('/kadonneet', (req, res) => {
  res.render('kadonneet', {
    navigation: ReactDOMServer.renderToString(Navigation({selectedIndex: 0})),
    losts: ReactDOMServer.renderToString(Losts({items: allMissings})),
    description: content.description,
    quotetext: content.quotetext,
    quoteauthor: content.quoteauthor
  });
});

app.listen(app.get('port'), function () {
  console.log('up and running...');
});
