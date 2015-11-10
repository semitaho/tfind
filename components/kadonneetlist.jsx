import React from 'react';
import KadonneetMap from './kadonneetSearchMap.jsx';

export default class KadonneetList extends React.Component{
  constructor(){
    super();
    this.state = {item: null};
    this.closeMap = this.closeMap.bind(this);
  }

  clickButton(item){
    this.setState({item: item});
  }

  closeMap(){
    this.setState({item:null});
  };

  render(){
    return <div>
            <div className="list-group">
              {this.props.items.map((item,key)=> {
                  return <button key={'search_'+key} className="list-group-item" onClick={this.clickButton.bind(this,item)}>  {item.name}<span className="pull-right glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>;
              })}
            </div>  
            {this.state.item !== null ?  <KadonneetMap item={this.state.item} onclose={this.closeMap}  /> : ''}
          </div>
  }

}