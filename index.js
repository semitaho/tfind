require('babel/register');
var React = require('react'),
  ReactDOMServer = require('react-dom/server')
express = require('express'),
  multer = require('multer'),
  bodyParser = require('body-parser'),
  stylus = require('stylus'),
  nib = require('nib'),
  content = require('./resources/content.json'),
  tfindApp = require('./components/tfindApp.jsx'),
  findingFormJsx = require('./components/findingform.jsx'),
  ukkformjsx = require('./components/questionsanswers.jsx'),
  lostsgrid = require('./components/lostsgrid.jsx'),
  kadonneetlistjsx = require('./components/kadonneetlist.jsx'),
  kadonnutFormjsx = require('./components/kadonnutform.jsx'),
  nav = require('./components/navigation.jsx'),
  app = module.exports = express(),
  upload = multer({dest: './public/files'});

var Navigation = React.createFactory(nav),
  Losts = React.createFactory(lostsgrid),
  Findingform = React.createFactory(findingFormJsx),
  KadonnutForm = React.createFactory(kadonnutFormjsx),
  UKKForm = React.createFactory(ukkformjsx),
  KadonneetList = React.createFactory(kadonneetlistjsx);

app.set('port', (process.env.PORT || 8080));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
var errorRoute = (req, res) => {
  res.render('error', {
    navigation: ReactDOMServer.renderToString(Navigation({selectedIndex: -1}))
  });
};

var ObjectId = require('mongodb').ObjectID;
var mongoConnection = require('./mongodb.js').mongoConnection;
mongoConnection.then(function (db) {
  console.log('mongodb successfully connected...');
  var kadonneetCollection = db.collection('kadonneet'),
    ukkCollection = db.collection('ukk');
  var collections = {ukk: ukkCollection, kadonneet: kadonneetCollection};
  return collections
}).then(function (collections) {
  app.get('/', (req, res) => {
    res.render('index', {
      navigation: ReactDOMServer.renderToString(Navigation({selectedIndex: -1})),
      description: content.description,
      quotetext: content.quotetext,
      quoteauthor: content.quoteauthor
    });
  });

  app.post('/submitfinding', upload.single('pic'), (req, res) => {
    var findings = {
      timestamp: parseInt(req.body.timestamp, 10),
      description: req.body.description,
      type: req.body.tyyppi,
      lat: parseFloat(req.body.lat, 10),
      lng: parseFloat(req.body.lng, 10)
    };
    collections.kadonneet.update({_id: new ObjectId(req.body._id)}, {'$push': {'findings': findings}}, function (err, result) {
      if (err) {
        res.redirect('/error');
        return;
      }
      res.redirect('/kadonneet');
    });
  });

  app.post('/savemarking', (req, res) => {
    console.log('body', req.body);
    var copy = Object.assign({}, req.body);
    copy.searchResult = parseInt(copy.searchResult, 10);
    delete copy._id;

    collections.kadonneet.update({_id: new ObjectId(req.body._id)}, {'$push': {'markings': copy}}, function (err, result) {
      if (err) {
        res.redirect('/error');
        return;
      }
      res.end('OK');
    });
  });
  app.get('/kadonneet', (req, res) => {
    collections.kadonneet.find().sort({timestamp: -1}).toArray(function (err, docs) {
      if (err) {
        res.error();
        return;
      }
      res.render('kadonneet', {
        items: docs,
        navigation: ReactDOMServer.renderToString(Navigation({selectedIndex: 0})),
        losts: ReactDOMServer.renderToString(Losts({items: docs})),
        description: content.description,
        quotetext: content.quotetext,
        quoteauthor: content.quoteauthor
      });

    });

  }).get('/etsi', (req, res) => {
    collections.kadonneet.find({}, {name: 1, imgsrc: 1}).sort({name: 1}).toArray((err, docs) => {
      res.render('etsi', {
        kadonneet: docs,
        kadonneetlist: ReactDOMServer.renderToString(KadonneetList({items: docs})),
        navigation: ReactDOMServer.renderToString(Navigation({selectedIndex: 2}))
      });
    });

  }).get('/ilmoita', (req, res) => {
    res.render('lisaakadonnut', {
      navigation: ReactDOMServer.renderToString(Navigation({selectedIndex: 1})),
      kadonnutform: ReactDOMServer.renderToString(KadonnutForm({}))
    });
  }).get('/ukk', (req, res) => {
    collections.ukk.find({}).sort({jnro: 1}).toArray((err, docs) => {
      if (err) {
        res.error();
        return;
      }
      res.render('ukk', {
        navigation: ReactDOMServer.renderToString(Navigation({selectedIndex: 3})),
        ukkform: ReactDOMServer.renderToString(UKKForm({items: docs}))
      });
    });

  });

// error
  app.get('*', errorRoute);

})
;

app.listen(app.get('port'), function () {
  console.log('up and running...');
});
