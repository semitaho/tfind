import React from 'react';
import KadonnutForm from './Kadonnutform.jsx';
import { Provider } from 'react-redux'
import {createStore} from 'redux';
function formstate(state = {}, action){

}

let store = createStore(formstate);
const KadonnutFormWrapper = (props) => {
  return (
    <Provider store={store}>
      <KadonnutForm />
    </Provider>
    )
};

export default KadonnutFormWrapper;