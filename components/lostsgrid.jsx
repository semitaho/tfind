import React from 'react';
import GridItem from './griditem.jsx';
class LostsGrid extends React.Component {

  render() {

    var items = this.props.items.map((item, key) => {
      let idkey = 'thumbnail_' + key;
      return (<div key={idkey} className="col-lg-12 col-md-12 col-sm-12">
        <GridItem item={item}/></div>)
    });
    return (<div className="row">{items}</div>)
  }
}

LostsGrid.propTypes = {
  items: React.PropTypes.array.isRequired
};
export default LostsGrid;