import React from 'react/addons';
import ReactDOM from 'react-dom';
const CheckboxWithLabel = require('../../components/checkboxWithLabel');
var TestUtils = React.addons.TestUtils;

describe('ukk page tests', _ => {
  it('tests initial render', () => {
    var elems = [{question: "eka kyssäri", answer: "Vastaus ekaan"}, {
      question: "toka kyssäri",
      answer: "Vastaus tokaan"
    }];
    console.log('testss');
    var ukk = TestUtils.renderIntoDocument(
      <CheckboxWithLabel labelOn="On" labelOff="Off"/>
    );
  });

});