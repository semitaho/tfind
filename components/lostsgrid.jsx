import React from 'react';
import GridItem from './griditem.jsx';
export default class LostsGrid extends React.Component {

  render() {

    var items = this.props.items.map((item,key) => {
      let idkey = 'thumbnail_'+key;
      return (<div key={idkey} className="col-lg-3 col-md-4 col-sm-6">
          <GridItem item={item} /></div>)
    });
    return (<div className="row">{items}</div>)
  }
}

LostsGrid.propTypes = {
  items: React.PropTypes.array.isRequired
};sss