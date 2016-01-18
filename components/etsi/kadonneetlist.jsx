import React from 'react';
import KadonneetMap from './kadonneetSearchMap.jsx';
import Page from './../page.jsx';
import { connect } from 'react-redux'
import {toggleEtsiModal, markToMap} from './etsiactions.js';
import {changeRadius, onMapClick} from './../mapactions.js';
class KadonneetList extends React.Component{
  constructor(){
    super();
  }

  render(){
    return <Page title="Etsi kadonnutta">
              <p className="lead">Valitse listalta kadonnut henkilö ja suorita etsintä</p>
              <div className="list-group">
                {this.props.items.map((item,key)=> {
                  return <button key={'search_'+key} className="list-group-item" onClick={() => this.props.toggleEtsiModal(true, item) }>  {item.name}<span className="pull-right glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>;
                })}
              </div>  
              {this.props.modal && this.props.modal.show ?  <KadonneetMap onMapClick={this.props.onMapClick} changeRadius={this.props.changeRadius} markToMap={(radius, katoamisloc) =>  this.props.markToMap(radius, katoamisloc) } {...this.props.mapstate}  {...this.props.modal} onclose={() => this.props.toggleEtsiModal(false)}  /> : ''}
          </Page>
  }
}

const mapStateToProps = state => {
  return {
    mapstate: state.mapstate,
    items: state.etsistate.items,
    modal: state.etsistate.modal
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleEtsiModal: (isopen, item) => dispatch(toggleEtsiModal(isopen,item)),
    markToMap: (radius, katoamisloc) => dispatch(markToMap(radius, katoamisloc)),
    changeRadius: (radius) => dispatch(changeRadius(radius)),
    onMapClick: (event) => dispatch(onMapClick(event)),


  };
};

export default connect(mapStateToProps,mapDispatchToProps)(KadonneetList);