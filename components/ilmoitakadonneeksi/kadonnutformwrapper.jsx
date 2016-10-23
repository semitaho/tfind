import React from 'react';
import KadonnutForm from './kadonnutform.jsx';
import {changeField, togglePage,save} from './kadonnutformactions.js';
import {selectArea, changeRadius} from './../mapactions.js';
import {toggleSpinner} from './../spinneractions.js';

import { connect } from 'react-redux'


class KadonnutFormWrapper extends React.Component  {
  

  render(){
    let {dispatch, formprops, mapstate, formactions, mapactions, loading} = this.props;
    return (
      <KadonnutForm loading={loading} {...formprops} {...mapstate} {...formactions} {...mapactions}  />
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
    this.props.mapactions.selectArea(event);

  }
};

function mapStateToProps(state){
  return {
    formprops: state.formstate,
    mapstate: state.mapstate,
    loading: state.loading
  };
}
function mapDispatchToProps(dispatch){
  return {


    mapactions: {
      changeRadius: radius => dispatch(changeRadius(radius)),
      selectArea: event => dispatch(selectArea(event))
    },
    formactions: {
      onSave: data => dispatch(save(data)),
      togglePage: page => dispatch(togglePage(page)),
      changeField: (field,value) => dispatch(changeField(field,value))
    }
  }

}

export default connect(mapStateToProps,mapDispatchToProps)(KadonnutFormWrapper);