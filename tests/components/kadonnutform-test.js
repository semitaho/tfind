import React from 'react';
import ReactDOM from 'react-dom';

import KadonnutForm from '../../components/ilmoitakadonneeksi/kadonnutform.jsx';
import TestUtils  from 'react-addons-test-utils';

describe('kadonnutform tests', _ => {
  it('tests writing name', () => {
    let form = TestUtils.renderIntoDocument(<KadonnutForm />); 
    expect(TestUtils.isCompositeComponent(form)).toBeTruthy();
    const FBOKCLASS = 'glyphicon-ok';
    let nameComponent =  TestUtils.findRenderedDOMComponentWithTag(form, 'input');
    TestUtils.Simulate.blur(nameComponent, {target: {name: 'name', value:'Toni Aho'}});
    var successes = TestUtils.scryRenderedDOMComponentsWithClass(form, FBOKCLASS);
    expect(successes.length).toEqual(1);

    var inputs = TestUtils.scryRenderedDOMComponentsWithClass(form, 'form-control');
    expect(inputs.length).toEqual(2);
    // do something with desc
    let descComponent =  TestUtils.findRenderedDOMComponentWithTag(form, 'textarea');
    expect(TestUtils.isDOMComponent(descComponent)).toBeTruthy();

    TestUtils.Simulate.blur(descComponent, {target: {name: 'description', value:'Kadonnut 9.5, ei tiedossa olinpaikkaa....'}});
    var successes = TestUtils.scryRenderedDOMComponentsWithClass(form, FBOKCLASS);
    expect(successes.length).toEqual(2);

  });

});