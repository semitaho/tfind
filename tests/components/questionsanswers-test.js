import React from 'react';
import ReactDOM from 'react-dom';

import UKKForm from '../../components/questionsanswers.jsx';
import TestUtils  from 'react-addons-test-utils';

describe('ukk page tests', _ => {
  it('tests initial render', () => {
    var elems = [{question: "eka kyssäri", answer: "Vastaus ekaan"}, {
      question: "toka kyssäri",
      answer: "Vastaus tokaan"
    }];
    let ukk = TestUtils.renderIntoDocument(<UKKForm items={elems} />);
    let components = TestUtils.scryRenderedDOMComponentsWithClass(ukk, 'lead');
    expect(components.length).toBe(2);
 
  });

});