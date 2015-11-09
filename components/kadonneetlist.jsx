import React from 'react';
import KadonneetMap from './kadonneetSearchMap.jsx';

export default class KadonneetList extends React.Component{
  constructor(){
    super();
    this.state = {item: null};
  }

  clickButton(item){
    this.setState({item: item});
  }

  render(){
    return <div>
            <div className="list-group">
              {this.props.items.map((item,key)=> {
                  return <button key={'search_'+key} className="list-group-item" onClick={this.clickButton.bind(this,item)}>  {item.name}<span className="pull-right glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>;
              })}
            </div>  
            {this.state.item !== null ?  <KadonneetMap item={this.state.item} /> : ''}
          </div>
  }

}