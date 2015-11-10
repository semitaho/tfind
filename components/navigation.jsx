import React from 'react';

export default class Navigation extends React.Component {
  render() {
    var navitems = this.props.items.map((item, index) => {
      var className = '';
      if (this.props.selectedIndex === index) {
        className = 'active';
      }
      return (<li className={className}>
        <a href={item.link}>{item.title}</a>
      </li>)

    });
    return (
      <nav className="navbar navbar-default navbar-static-top">
        <div className="row hidden-xs">
          <div className="col-md-2 col-sm-2 col-lg-2 hidden-xs">
            <div className="navbar-header navbar-right">
              <a className="navbar-brand" href="/">tFind</a>
            </div>
            </div>
           <div className="col-md-8 hidden-xs col-sm-8"> 
            <ul className="navbar-nav nav navbar-center">
              {navitems}
            </ul>
            </div>
            <div className="col-md-2 col-sm-2 hidden-xs">
              <ul className="nav navbar-nav">
                <li>
                  <a href="#">
                    <img id="facebook" title="Kadonneet Facebookissa" data-toggle="tooltip" data-placement="bottom"
                       src="/images/FB-f-Logo__blue_29.png"/>
                  </a>
                </li>
              </ul>
            </div>
         </div>
         <div className="row hidden-sm hidden-lg hidden-md">   

            <div className="col-xs-9 col-xs-push-1">
               <ul className="nav navbar-nav navbat-header">
                  <li className="dropdown">
                    <a className="dropdown-toggle" data-toggle="dropdown" href="/">tFind <span className="caret"></span></a>
                      <ul className="dropdown-menu">
                          {navitems}
                      </ul>
                  </li>
              </ul>
            </div>
          
           <div className="col-xs-2">
              <ul className="nav navbar-nav">
                <li>
                  <a href="#">
                    <img id="facebook" title="Kadonneet Facebookissa" data-toggle="tooltip" data-placement="bottom"
                       src="/images/FB-f-Logo__blue_29.png"/>
                  </a>
                </li>
              </ul>
            </div>
          </div>
      </nav>)


  }
}

Navigation.defaultProps = {items: [
  {title: 'Kadonneet', link: '/kadonneet'}, 
  {title: 'Ilmoita kadonneeksi', link: '/ilmoita'},
  {title: 'Etsi henkilöä', link: '/etsi'},
  {title: 'UKK', link: '/ukk'}
  ]};

