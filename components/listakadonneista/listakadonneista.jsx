import React from 'react';
import LostsGrid from './lostsgrid.jsx';
import { Provider, connect } from 'react-redux';
import {changeSearchCriteria, receiveTimeout} from './listakadonneistaactions.js';
import {onHavainnotClick} from './havainnotkartallaactions.js';
class ListaKadonneista extends React.Component{
  render(){
    let {dispatch, listakadonneista} = this.props;
    return (
      <LostsGrid {...listakadonneista} onHavainnotClick={item =>  dispatch(onHavainnotClick(item))}  receiveTimeout={(index,time) => dispatch(receiveTimeout(index,time))}  changeSearchCriteria={current => dispatch(changeSearchCriteria(current)) } />
    )
  }
}

function mapStateToProps(state){
  return {
    listakadonneista: state.listakadonneistastate,
  };
}


export default connect(mapStateToProps)(ListaKadonneista);
