import React from 'react';
import CSSTransitionGroup from 'react/lib/ReactTransitionGroup';

export default class GridItem extends React.Component {


  constructor(){
    super();
    this.state = {current: 0};
  }
  render(){
    var item = this.props.item;
    var self = this;
    console.log('current index, '+this.state.current);
    return (
      <a href="#" className="thumbnail">
          {item.thumbnails.map( (src, ind) => {
            return (
              <div key={src}>
              <CSSTransitionGroup key={src} 
                  transitionEnter={false} 
                  transitionName="thumb"
                  transitionAppear={self.state.current === ind} 
                  transitionAppearTimeout={6000} 
                  transitionLeaveTimeout={8000} >
                   <img key={ind} className="img-rounded img-responsive fixed-height" src={src}/>
              </CSSTransitionGroup>
              </div>
              )
            }
          )}
          <div className="caption"><h4>{item.name}</h4></div>
         </a> 
      ) 
  }

  appeared(){
    console.log('did appear');
  }

  componentWillAppear(callback){
    console.log('aijaa');
  }
}