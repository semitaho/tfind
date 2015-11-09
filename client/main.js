import ReactDOM from 'react-dom';
import React from 'react';
import LostsGrid from '../components/lostsgrid.jsx';
import FindingForm from '../components/findingform.jsx';
import Spinner from '../components/spinner.jsx';
import KadonnutForm from '../components/kadonnutform.jsx';
import KadonneetList from '../components/kadonneetlist.jsx';

var main = document.getElementById('losts'),
  form = document.getElementById('findingform'),
  kadonnut = document.getElementById('kadonnutform'),
  kadonneetlist = document.getElementById('kadonneetlist');

var losts = [];
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

if (kadonneetlist){
  ReactDOM.render(<KadonneetList items={kadonneetItems} />, kadonneetlist);

}

