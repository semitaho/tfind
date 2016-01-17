import React from "react";
import { Router, Route, IndexRoute } from 'react-router'

import AppHandler from "./components/app.jsx";
import Home from './components/home.jsx';
import Kadonneet from './components/listakadonneista/listakadonneista.jsx';
import KadonneetKartalla from './components/kadonneetkartalla/kadonneetkartalla.jsx';
import IlmoitaKadonneeksi from './components/ilmoitakadonneeksi/kadonnutformwrapper.jsx';
import KadonneetList from './components/etsi/kadonneetlist.jsx';
import Ukk from './components/questionsanswers.jsx';
import NoMatch from './components/nomatch.jsx';

export default (  
  <Route component={ AppHandler } path="/">
      <IndexRoute component={Home}/>
      <Route path="/kadonneet" component={Kadonneet}/>
      <Route path="/kadonneetkartalla" component={KadonneetKartalla}/>
      <Route path="/ilmoita" component={IlmoitaKadonneeksi}/>
      <Route path="/etsi" component={KadonneetList}/>
      <Route path="/ukk" component={Ukk}/>
      <Route path="*" component={NoMatch}/>


  </Route>
);