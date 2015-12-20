import React from 'react';
import {Route, Link, Handler} from 'react-router';
import Navigation from './navigation.jsx';

const App = (props) => {
  const {children} = props;
  return (<div>
            <div className="row">
              <div className="col-md-12 col-sm-12 col-xs-12">
                <nav id="navigation">
                  <Navigation />
                </nav>
              </div>
             </div>  
            {children}
          </div>
          )  
};

export default App;