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
          <div className="col-md-8 end col-md-offset-2">
            <div className="navbar-header navbar-left">
              <button className="navbar-toggle" data-toggle="collapse" type="button" aria-expanded="true" data-target="#collapsing" aria-controls="collapsing">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand pull-left" href="/">tFind</a>
            </div>
           
            <div className="collapse  navbar-collapse" id="collapsing">
                <ul className="navbar-nav nav">
                  {navitems}
                 </ul>
                 <ul className="navbar-nav nav navbar-right"> 
                    <li><a href="#"><img id="facebook" title="Kadonneet Facebookissa" data-toggle="tooltip" data-placement="bottom"
                       src="/images/FB-f-Logo__blue_29.png"/></a>
                    </li>
                </ul>
            </div>
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

