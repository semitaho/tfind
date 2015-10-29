import React from 'react';

export default class LostsGrid extends React.Component {

  render() {

    console.log('items', this.props.items);
    var items = this.props.items.map(item => {
      return (<div className="col-lg-3 col-md-4 col-sm-6"><a href="#" className="thumbnail"><img className="img-rounded img-responsive fixed-height"
                                                                               src={item.imgsrc}/>

        <div className="caption"><h4>{item.name}</h4></div>
      </a></div>)
    });
    return (<div className="row">{items}</div>)
  }
}

LostsGrid.propTypes = {
  items: React.PropTypes.array.isRequired
};sss