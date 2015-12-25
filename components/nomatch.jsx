import React from 'react';
import Page from './page.jsx';
const NoMatch = props => {
  return (<Page title="OOPS!">
          <p>Pyytämäsi sivu ei ole saatavilla.</p>
          </Page>);
};

export default NoMatch;
  