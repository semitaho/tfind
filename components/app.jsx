import React from 'react';
import {Route, Link, Handler} from 'react-router';
import Navigation from './navigation.jsx';

const App = (props) => {

  const {children} = props;
  var clientsProps = {params: []};
  if (props.params && Object.keys(props.params).length > 0 ){
    console.log('server props');
    clientsProps.params = props.params;
  }
  if (typeof clientProps !== 'undefined'){
    console.log('client props');
    clientsProps.params = clientProps.params;
  }

  let newChildren = React.cloneElement(children,  clientsProps);
  return (<div>
            <div className="row">
              <div className="col-md-12 col-sm-12 col-xs-12">
                <nav id="navigation">
                  <Navigation navindex={clientsProps.params.navindex} />
                </nav>
              </div>
             </div>  
            {newChildren}
    
          </div>
          )  
};

export default App;