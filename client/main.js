import ReactDOM from 'react-dom';
import React from 'react';
import LostsGrid from '../components/lostsgrid.jsx';
import FindingForm from '../components/findingform.jsx';
import Spinner from '../components/spinner.jsx';

var main = document.getElementById('losts'),
  form = document.getElementById('findingform');

var losts = [];
if (typeof items !== 'undefined') {
  losts = items;
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

