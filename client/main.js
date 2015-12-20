import React from 'react';
import ReactDOM from 'react-dom';
import LostsGrid from '../components/listakadonneista/lostsgrid.jsx';
import FindingForm from '../components/findingform.jsx';
import {RoutingContext} from 'react-router';
import App from '../components/app.jsx';
//import KadonnutForm from '../components/ilmoitakadonneeksi/kadonnutform.jsx';
//import KadonneetList from '../components/etsi/kadonneetlist.jsx';
//import KadonneetKartalla from '../components/kadonneetkartalla/kadonneetkartalla.jsx';

//import Navigation from '../components/navigation.jsx';

var main = document.getElementById('losts'),
  form = document.getElementById('findingform'),
  kadonnut = document.getElementById('kadonnutform'),
  nav = document.getElementById('navigation'),
  kadonneetkartalla = document.getElementById('kadonneetkartalla'),
  kadonneetlist = document.getElementById('kadonneetlist'),
  page = document.getElementById('page');

var losts = [];

console.log('props', page);
ReactDOM.render(<App {...props} />, page);

/*
if (typeof items !== 'undefined') {
  losts = items;
}

var kadonneetItems = [];
if (typeof kadonneet !== 'undefined'){
  kadonneetItems = kadonneet;
}

var lost = {};
if (typeof finding !== 'undefined') {
  lost = finding;
}
if (main) {
  ReactDOM.render(<LostsGrid items={losts}/>, main);
}
if (form) {
  ReactDOM.render(<FindingForm item={lost}/>, form);
}

if (kadonnut) {
  ReactDOM.render(<KadonnutForm />, kadonnut);
}
if (kadonneetkartalla){
  ReactDOM.render(<KadonneetKartalla items={losts} />, kadonneetkartalla);
}
if (kadonneetlist){
  ReactDOM.render(<KadonneetList  items={kadonneetItems} />, kadonneetlist);
}

*/