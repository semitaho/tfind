import React from 'react';
import GridItem from './griditem.jsx';
import Page from './../page.jsx';
import LostsModal from './lostsmodal.jsx';

import {Navbar, Input, Glyphicon} from 'react-bootstrap';
class LostsGrid extends React.Component {

  constructor() {
    super();
    this.changeSearchCriteria = this.changeSearchCriteria.bind(this);

  }

  filterByCriteria(search) {
    let searchLower = search.toLowerCase();
    let filteredItems = this.props.items.filter(item => {
      var nameLowercase = item.name.toLowerCase();
      var descriptionLowercase = item.description.toLowerCase();

      if (searchLower.length === 0) {
        return true;
      }
      if (nameLowercase.indexOf(searchLower) > -1) {
        return true;
      }

      if (descriptionLowercase.indexOf(searchLower) > -1) {
        return true;
      }
      return false;
    });
    return filteredItems;
  }

  changeSearchCriteria(event){
    this.props.changeSearchCriteria(event.target.value);
  }

  render() {
    let filteredItems = this.filterByCriteria(this.props.search);
    console.log('havainnot', this.props.havainnotkartalla);

    var items = filteredItems.map((item, key) => {
      let idkey = 'thumbnail_' + key;
      return (<div key={idkey} className="col-lg-12 col-md-12 col-sm-12">
        <GridItem item={item}  onHavainnotClick={item => this.props.onHavainnotClick(true, item)} receiveTimeout={date => this.props.receiveTimeout(key, date)}  /></div>)
    });

    return (
      <Page title="Oletko nähnyt heitä?">

      <div className="row">
      <div className="col-md-12 col-sm-12">
        <div className="row">
          <div className="col-md-12 col-sm-12">
            <label className="pull-left search-results">Tuloksia {filteredItems.length} / {this.props.items.length}</label> 
            <form className="navbar-form navbar-right" role="search">
            <div className="form-group">
            <Input type="text" placeholder="Hae kadonnutta"  addonAfter={<Glyphicon glyph="search" />}  onChange={this.changeSearchCriteria}/>
            </div>
            </form>
          </div>
         </div> 
      </div>
      {this.props.havainnotkartalla.show ? 
      <LostsModal {...this.props.havainnotkartalla} onCloseModal={() =>  this.props.onHavainnotClick(false) } /> : ''}
      {items}</div></Page>)
  }
}

export default LostsGrid;