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
        <div className="row">
          <div className="col-md-8 col-xs-12 col-sm-12 col-md-offset-2 end navbar-inner">
            <div className="navbar-header">
              <a className="navbar-brand" href="/">tFind</a>
            </div>
            <ul className="navbar-nav nav navbar-center">
              {navitems}
            </ul>
            <ul className="nav navbar-nav navbar-right">
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

