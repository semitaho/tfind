require('babel/register');
var React = require('react'),
  ReactDOMServer = require('react-dom/server')
express = require('express'),
  multer = require('multer'),
  stylus = require('stylus'),
  nib = require('nib'),
  content = require('./resources/content.json'),
  tfindApp = require('./components/tfindApp.jsx'),
  findingFormJsx = require('./components/findingform.jsx'),
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
  KadonneetList = React.createFactory(kadonneetlistjsx);

app.set('port', (process.env.PORT || 8080));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

var errorRoute = (req, res) => {
  res.render('error', {
    navigation: ReactDOMServer.renderToString(Navigation({selectedIndex: -1}))
  });
};

var ObjectId = require('mongodb').ObjectID;
var mongoConnection = require('./mongodb.js').mongoConnection;
mongoConnection.then(function (db) {
  console.log('mongodb successfully connected...');
  var kadonneetCollection = db.collection('kadonneet');
  return kadonneetCollection
}).then(function (kadonneetCollection) {
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
    kadonneetCollection.update({_id: new ObjectId(req.body._id)}, {'$push': {'findings': findings}}, function (err, result) {
      if (err) {
        res.redirect('/error');
        return;
      }
      res.redirect('/kadonneet');
    });
  });

  app.get('/kadonneet', (req, res) => {
    kadonneetCollection.find().sort({timestamp: -1}).toArray(function (err, docs) {
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

  });

  app.get('/etsi', (req,res) => {
    kadonneetCollection.find({}, {name: 1, imgsrc: 1}).sort({name: 1}).toArray((err, docs) => {
      res.render('etsi', {
        kadonneet: docs,
        kadonneetlist: ReactDOMServer.renderToString(KadonneetList({items: docs})),
        navigation: ReactDOMServer.renderToString(Navigation({selectedIndex: 2}))
      });
    });
   
  });

  app.get('/ilmoita', (req, res) => {
    res.render('lisaakadonnut', {
      navigation: ReactDOMServer.renderToString(Navigation({selectedIndex: 1})),
      kadonnutform: ReactDOMServer.renderToString(KadonnutForm({}))
    });
  });

  // error
  app.get('*', errorRoute);

});

app.listen(app.get('port'), function () {
  console.log('up and running...');
});
