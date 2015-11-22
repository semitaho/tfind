import React from 'react';
import GridItem from './griditem.jsx';
import {Navbar, Input} from 'react-bootstrap';
class LostsGrid extends React.Component {

  constructor() {
    super();
    this.state = {search: ''};

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

  render() {

    const changeSearchCriteria = event => {
      console.log('new criteria', event.target.value);
      this.setState({search: event.target.value});
    };

    let filteredItems = this.filterByCriteria(this.state.search);

    var items = filteredItems.map((item, key) => {
      let idkey = 'thumbnail_' + key;
      return (<div key={idkey} className="col-lg-12 col-md-12 col-sm-12">
        <GridItem item={item}/></div>)
    });
    return (<div className="row">
      <div className="col-md-12">
        <form className="navbar-form navbar-right" role="search">
          <div class="form-group">
            <input type="text" className="form-control" placeholder="Hae kadonnutta" onChange={changeSearchCriteria}/>
            <span className="glyphicon glyphicon-search" aria-hidden="true"></span>

          </div>
        </form>
      </div>
      {items}</div>)
  }
}

LostsGrid.propTypes = {
  items: React.PropTypes.array.isRequired
};
export default LostsGrid;