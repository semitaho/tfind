import React from 'react';

export default class LostsGrid extends React.Component {

  render() {

    var elems = [{imgsrc: 'http://is12.snstatic.fi/img/978/1442189230387.jpg'},
      {imgsrc: 'https://scontent-ams2-1.xx.fbcdn.net/hphotos-xpf1/v/t1.0-9/12191509_939796812760311_6575480075196608646_n.jpg?oh=3329273152130a10ded369798d86e1c9&oe=5687B7ED'},
      {imgsrc: 'https://scontent-ams2-1.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/12112169_935991673140825_5898787106234337019_n.jpg?oh=8604a07efad7c0fe65f86f4ff541eb8d&oe=568647D9'},
      {imgsrc: 'http://is12.snstatic.fi/img/978/1442189230387.jpg'},
      {imgsrc: 'http://is12.snstatic.fi/img/978/1442189230387.jpg'},
      {imgsrc: 'http://is12.snstatic.fi/img/978/1442189230387.jpg'},
      {imgsrc: 'http://is12.snstatic.fi/img/978/1442189230387.jpg'},
      {imgsrc: 'http://is12.snstatic.fi/img/978/1442189230387.jpg'}];

    var rowCount = elems.length % 6;
    var grid = [];

    var items = elems.map(item => {
      return ( <div className="col-md-2"><img className="thumbnail" src={item.imgsrc}/></div>)
    });
    console.log('rowcount', rowCount);
    return (<div className="row">{items}</div>)
  }
}