import React from 'react';
import {Route, Link, Handler} from 'react-router';
import Navigation from './navigation.jsx';
import { Provider, connect } from 'react-redux'
import {createStore, combineReducers,applyMiddleware} from 'redux';
import formstate from './ilmoitakadonneeksi/kadonnutformreducer.js';
import mapstate from './mapreducer.js';
import spinnerstate from './spinnerreducer.js';
import listakadonneistastate from './listakadonneista/listakadonneistareducer.js';
import ukkstate from './ukk/ukkreducer.js';
import etsistate from './etsi/etsireducer.js';

import thunkMiddleware from 'redux-thunk'

const App = (props) => {
  const app = combineReducers({
    formstate,
    mapstate,
    loading: spinnerstate,
    listakadonneistastate,
    etsistate,
    ukkstate
  });

  
  const {children} = props;
  var clientsProps = {params: []};
  var storeState = {};
  if (props.params && Object.keys(props.params).length > 0 ){
    console.log('server props');
    clientsProps.params = props.params;
    clientsProps.params.state = props.params.state;
    storeState = props.params.state;
  }
  if (typeof clientProps !== 'undefined' && clientProps.params.state){
    storeState = clientProps.params.state;
  }

  const createStoreMiddleware = applyMiddleware(thunkMiddleware)(createStore);
  const store = createStoreMiddleware(app, storeState);
  store.subscribe(() => {
    console.log('state', store.getState());
  });
  if (typeof clientProps !== 'undefined'){
    clientsProps.params = clientProps.params;
  }

  let newChildren = React.cloneElement(children,  clientsProps);
  return (<Provider store={store}>
          <div>
            <div className="row">
              <div className="col-md-12 col-sm-12 col-xs-12">
                <nav id="navigation">
                  <Navigation navindex={clientsProps.params.navindex} />
                </nav>
              </div>
             </div>  
            {newChildren}
          </div>
          </Provider>
          )  
};

export default App;