import React from 'react';
import ReactDOM from 'react-dom';
import Spinjs from '../vendor/spin.js';
import $ from 'jquery';

class Spinner extends React.Component {

  render() {
    return <div />
  }

  componentDidMount() {
    var spinjs = new Spinjs().spin();
    console.log('spinjs', spinjs);
    ReactDOM.findDOMNode(this).appendChild(spinjs.el);
    var jht = '';
    if (this.props.dimm) {
      var jht = $('#' + this.props.dimm);
    } else {
      jht = $('body');
    }
    jht.addClass('darkened');
  }

  componentWillUnmount() {
    var jht = $('#' + this.props.dimm);
    jht.removeClass('darkened');
  }


}

export default Spinner;