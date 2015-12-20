import React from "react";
import { Router, Route, IndexRoute } from 'react-router'

import AppHandler from "./components/app.jsx";
import Home from './components/home.jsx';
import Kadonneet from './components/listakadonneista/lostsgrid.jsx';


export default (  
  <Route component={ AppHandler } path="/">
      <IndexRoute component={Home}/>
      <Route path="/kadonneet" component={Kadonneet}/>

  </Route>
);