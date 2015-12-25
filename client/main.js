
import React from 'react';
import {render} from 'react-dom';
import {Router, match} from 'react-router';
import routes from '../routes.js';
import createBrowserHistory from 'history/lib/createBrowserHistory'

var main = document.getElementById('losts'),
  form = document.getElementById('findingform'),
  kadonnut = document.getElementById('kadonnutform'),
  nav = document.getElementById('navigation'),
  kadonneetkartalla = document.getElementById('kadonneetkartalla'),
  kadonneetlist = document.getElementById('kadonneetlist'),
  page = document.getElementById('page');

let history = createBrowserHistory();
render(<Router history={history} children={routes} />, page); 