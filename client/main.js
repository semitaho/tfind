import ReactDOM from 'react-dom';
import React from 'react';
import LostsGrid from '../components/lostsgrid.jsx';
var main = document.getElementById('losts');
var allMissings = require('..//resources/missings.json');
ReactDOM.render(<LostsGrid items={allMissings} />, main);
