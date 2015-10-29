import React from 'react';
import CSSTransitionGroup from 'react/lib/ReactTransitionGroup';

export default class GridItem extends React.Component {


  constructor() {
    super();
    this.state = {current: 0};
    this.onTimeout = this.onTimeout.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(this.onTimeout, this.props.interval);
  }

  onTimeout() {
    var currentIndex = this.state.current;
    currentIndex += 1;
    if (currentIndex >= this.props.item.thumbnails.length) {
      currentIndex = 0;
    }

    this.setState({current: currentIndex});
  }


  render() {
    var item = this.props.item;
    var self = this;
    console.log('current index, ' + this.state.current);
    return (
      <a href="#" className="thumbnail">
        {item.thumbnails.map((src, ind) => {
            var clazz = 'img-rounded img-responsive fixed-height fadeinout';
            if (ind !== self.state.current){
              clazz += 'mg-rounded img-responsive fixed-height hide';
            } else if (item.thumbnails.length === 1){
              clazz = 'img-rounded img-responsive fixed-height fadein';
            }

            return (
              <img key={ind} className={clazz} src={src}/>
            )
          }
        )}
        <div className="caption"><h4>{item.name}</h4></div>
      </a>)
  }

}

GridItem.defaultProps = {interval: 4000};