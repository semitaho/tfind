import React from 'react';
import KadonnutForm from './Kadonnutform.jsx';
import {changeField, togglePage,save} from './kadonnutformactions.js';
import {selectArea, changeRadius} from './../mapactions.js';
import {toggleSpinner} from './../spinneractions.js';

import { Provider, connect } from 'react-redux'


class KadonnutFormWrapper extends React.Component  {
  

  render(){
    let {dispatch, formprops, mapstate, loading} = this.props;
    return (
      <KadonnutForm loading={loading} {...formprops} {...mapstate}  onSave={(data) => dispatch(save(data))} changeRadius={radius => dispatch(changeRadius(radius))} selectArea={event => dispatch(selectArea(event))} togglePage={page => dispatch(togglePage(page))}  changeField={(field,value) => dispatch(changeField(field,value))} />
    )
  }

  componentDidMount(){
    console.log('latlng', this.props.mapstate.center);
    let event = {
      latLng: {
        lat: () => this.props.mapstate.center.lat,
        lng: () => this.props.mapstate.center.lng
      }
    };
    this.props.dispatch(selectArea(event));
    this.props.dispatch(toggleSpinner(true));

  }
};

function mapStateToProps(state){
  return {
    formprops: state.formstate,
    mapstate: state.mapstate,
    loading: state.loading
  };
}

export default connect(mapStateToProps)(KadonnutFormWrapper);