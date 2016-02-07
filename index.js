import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express  from 'express';
import multer from 'multer';
import bodyParser from 'body-parser';
import stylus from 'stylus';
import nib from 'nib';
import findingFormJsx from './components/findingform.jsx';
import ukkformjsx from './components/questionsanswers.jsx';
import lostsgrid from './components/listakadonneista/lostsgrid.jsx';
import kadonneetlistjsx from './components/etsi/kadonneetlist.jsx';
import kadonnutFormjsx from './components/ilmoitakadonneeksi/kadonnutform.jsx';
import nav from './components/navigation.jsx';
import kadonneetkartallajsx from './components/kadonneetkartalla/kadonneetkartalla.jsx';
import {Router, match, RoutingContext} from 'react-router';
import routes from './routes';


let app = express();
let upload = multer({dest: './public/files'});

var Navigation = React.createFactory(nav),
  Losts = React.createFactory(lostsgrid),
  Findingform = React.createFactory(findingFormJsx),
  KadonnutForm = React.createFactory(kadonnutFormjsx),
  UKKForm = React.createFactory(ukkformjsx),
  KadonneetKartalla = React.createFactory(kadonneetkartallajsx),
  KadonneetList = React.createFactory(kadonneetlistjsx);

app.set('port', (process.env.PORT || 8080));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.pretty = true;
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
var errorRoute = (req, res) => {
  res.render('error', {
    navigation: ReactDOMServer.renderToString(Navigation({selectedIndex: -1}))
  });
};

var ObjectId = require('mongodb').ObjectID;
var mongoConnection = require('./mongodb.js').mongoConnection;

const renderPage =(res, renderProps) => {
  const page = ReactDOMServer.renderToString(<RoutingContext {...renderProps}  />);
  res.render('layout', {
    page,
    renderProps
  });
};

const doRender = (res, collections,renderProps) => {
  switch (renderProps.location.pathname){
    case '/':
      collections.contents.find().toArray((err, docs) => {
        let content = docs[0];
        renderProps.params.quotetext = content.quotetext;
        renderProps.params.quoteauthor = content.quoteauthor;
        renderProps.params.description = content.description;
        renderProps.params.navindex = -1;
        renderPage(res, renderProps);
        
      });
      break;
    case '/kadonneet': 
      collections.kadonneet.find().sort({timestamp: -1}).toArray(function (err, docs) {
        if (err) {
          res.error();
          return;
        }
        renderProps.params.state = {
          listakadonneistastate: {
            items: docs,
            search: '',
            havainnotkartalla: {show:false}
          },
          mapstate: {}
        };
        renderProps.params.navindex = 0;
        renderPage(res, renderProps);
      });
      break;  
    case '/kadonneetkartalla':
      collections.kadonneet.find().toArray(function (err, docs) {
        if (err) {
          res.error();
          return;
        }
        renderProps.params.navindex = 1;
        renderProps.params.items = docs;
        renderPage(res, renderProps);
      });
      break;
    case '/ilmoita':
      renderProps.params.navindex = 2;
      renderProps.params.state= {formstate: {formstate: {},  active: 1},mapstate: {
        initialZoom: 7,
        radius: 7000,
        circle: {lat: 65.7770391, lng: 27.1159877},
        center: {lat: 65.7770391, lng: 27.1159877}
      }};
      renderPage(res, renderProps);
      break;
    case '/etsi':
      collections.kadonneet.find().sort({name: 1}).toArray((err, docs) => {
        if (err) {
          res.error();
          return;
        }
        renderProps.params.navindex = 3;
        renderProps.params.state ={
          etsistate: {
            items:docs,
            modal: {
              show: false
            }
          }
        };
        renderPage(res, renderProps);
      });
      break;
    case '/ukk':
    collections.ukk.find({}).sort({jnro: 1}).toArray((err, docs) => {
        if (err) {
          res.error();
          return;
        }
        renderProps.params.navindex = 4;
        renderProps.params.state = {
          ukkstate: {
            items: docs
          }

        };
        renderPage(res, renderProps);
      });
      break;  
    default:
      console.log('no matching route exists');  
      renderPage(res, renderProps);
  } 
};
mongoConnection.then(db => {
  console.log('mongodb successfully connected...');
  var kadonneetCollection = db.collection('kadonneet'),
    contentCollection = db.collection('content'),
    ukkCollection = db.collection('ukk');
  var collections = {ukk: ukkCollection, kadonneet: kadonneetCollection, contents: contentCollection};
  return collections
}).then(collections => {
  
  app.get('/*', (req, res) => {
    console.log('url', req.url);
    match({routes, location: req.url}, (error, redirectloc, renderProps) => {
      if (error){      
        res.status(500).send(error.message);
      } else if (redirectloc){
        res.redirect(302, redirectloc.pathname + redirectloc.search);
      } else if (collections, renderProps){
          doRender(res, collections, renderProps);
      } else {
        res.redirect('error');

      }


    });
  }).post('/submitfinding', upload.single('pic'), (req, res) => {
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
  }).post('/saveilmoita', (req, res) => {
    var copy = {
      name: req.body.name,
      age: req.body.age,
      description: req.body.description,
      imgsrc: req.body.imgsrc,
      radius: req.body.radius,
      address: req.body.address,
      thumbnails: [req.body.imgsrc],

      findings: [{
        type: '1',
        description: 'Viimeisin havainto ennen katoamista',
        lat: req.body.location.lat,
        lng: req.body.location.lng,
        timestamp: parseInt(req.body.timestamp, 10)
      }],
      lost: {timestamp: parseInt(req.body.timestamp, 10)}
    };
    collections.kadonneet.insertOne(copy, function (err, result) {
      if (err) {
        res.redirect('/error');
        return;
      }
      res.end('OK');
    });
  }).post('/savemarking', (req, res) => {
    console.log('body', req.body);
    var copy = Object.assign({}, req.body);
    copy.searchResult = parseInt(copy.searchResult, 10);
    delete copy.saving;
    delete copy._id;

    collections.kadonneet.update({_id: new ObjectId(req.body._id)}, {'$push': {'markings': copy}}, function (err, result) {
      if (err) {
        res.redirect('/error');
        return;
      }
      res.end('OK');
    });
  }).get('/kadonneet/:id', (req, res) => {
    collections.kadonneet.find({_id:new ObjectId(req.params.id)}).toArray(function (err, docs) {
      if (err) {
        res.error();
        return;
      }
      console.log('foc', docs);
      res.render('profiili', {
        item: docs[0],
        navigation: ReactDOMServer.renderToString(Navigation({selectedIndex: 0}))
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
