import React from 'react';

export default class LostsGrid extends React.Component {

  render() {

    console.log('items', this.props.items);
    var items = this.props.items.map(item => {
      return (<div className="col-md-2"><a href="#" className="thumbnail"><img className="img-rounded fixed-height"
                                                                               src={item.imgsrc}/>

        <div className="caption"><h4>{item.name}</h4></div>
      </a></div>)
    });
    return (<div className="row">{items}</div>)
  }
}

LostsGrid.propTypes = {
  items: React.PropTypes.array.isRequired
};