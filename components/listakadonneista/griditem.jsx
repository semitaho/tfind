import React from 'react';
import {Button, Carousel, CarouselItem} from 'react-bootstrap';
import LostsModal from './lostsmodal.jsx';
import FindingForm from './../findingform.jsx';
import KadonnutNews from './../kadonnutNews.jsx';
import TextFormatter from './../../utils/textformatter.js';
class GridItem extends React.Component {

  constructor() {
    super();
    this.state = {current: 0, kadonnutTime: 0, showmodal: false};
    this.onTimeout = this.onTimeout.bind(this);
    this.onModalOpen = this.onModalOpen.bind(this);
    this.onFormOpen = this.onFormOpen.bind(this);

    this.onModalClose = this.onModalClose.bind(this);
    this.onFormClose = this.onFormClose.bind(this);

    this.onKadonnutTimeout = this.onKadonnutTimeout.bind(this);
    this.onNewsOpen = this.onNewsOpen.bind(this);
    this.onNewsHide = this.onNewsHide.bind(this);

  }

  componentDidMount() {
    this.imageInterval = setInterval(this.onTimeout, this.props.interval);
    if (this.props.item && this.props.item.lost) {
      this.kadonnutInterval = setInterval(this.onKadonnutTimeout, 1000);

    }

  }

  formatToTime(milliseconds) {
    var seconds = Math.round((milliseconds / 1000.0));
    var daysDivide = 3600 * 24;
    var days = ~~(seconds / daysDivide);
    var hrs = ~~((seconds % daysDivide) / 3600);
    var minutes = ~~((seconds % 3600 ) / 60);
    var secs = seconds % 60;
    var toDays = milliseconds / (1000 * 60 * 60 * 24);
    var strBuilder = days + ' päivää, ' + hrs + ' tuntia, ' + minutes + " minuuttia, " + secs + " sekuntia.";
    return strBuilder;

  }

  onKadonnutTimeout() {
    var kadonnutTime = new Date().getTime() - this.props.item.lost.timestamp;
    this.setState({kadonnutTime: this.formatToTime(kadonnutTime)});
  }

  onTimeout() {
    var currentIndex = this.state.current;
    currentIndex += 1;
    if (currentIndex >= this.props.item.thumbnails.length) {
      currentIndex = 0;
    }

    this.setState({current: currentIndex});
  }

  getKadonnut() {
    if (this.state.kadonnutTime === 0) {
      return '';
    }
    return this.state.kadonnutTime;
  }

  onModalOpen() {
    this.setState({showmodal: true});

  }

  onFormOpen() {
    this.setState({showform: true});

  }

  onModalClose() {
    this.setState({showmodal: false});
  }

  onFormClose() {
    this.setState({showform: false});

  }

  onNewsOpen() {
    this.setState({shownews: true});

  }

  onNewsHide() {
    this.setState({shownews: false});
  }

  render() {
    var item = this.props.item;
    var self = this;
    let formattedDescription = TextFormatter.formatToHTML(item.description);
    return <div className="thumbnail text-left">
      {this.state.showmodal ? <LostsModal item={item} onclosemodal={this.onModalClose}/> : ''}
      {this.state.showform ? <FindingForm item={item} onclosemodal={this.onFormClose}/> : ''}
      {this.state.shownews ? <KadonnutNews onHide={this.onNewsHide} item={item}/> : ''}

      <div className="row">
        <div className="col-md-5 col-sm-5">
          <Carousel indicators={false} controls={true} interval={this.props.interval}>
            {item.thumbnails.map((src, ind) => {
                var clazz = 'img-rounded img-responsive center-block fixed-height';
                var keyindex = 'carousel_' + ind;
                return (
                  <CarouselItem key={keyindex}>
                    <img key={ind} className={clazz} src={src}/>
                  </CarouselItem>
                )
              }
            )}
          </Carousel>
        </div>
        <div className="col-md-7 col-sm-7">
          <div className="caption">
            <h3>{item.name}</h3>

            <div dangerouslySetInnerHTML={{__html: formattedDescription}}/>
            <div className="btn-group">
              <Button bsStyle="info" onClick={self.onModalOpen}>Havainnot kartalla
                ({this.props.item.findings.length})</Button>
              <Button bsStyle="info" onClick={this.onNewsOpen}>Uutiset henkilöstä {item.name}</Button>
              <Button bsStyle="success" onClick={self.onFormOpen}>Ilmoita havainnosta</Button>
            </div>
            {self.state.kadonnutTime === 0 ? '' : <p className="text-primary">Kadonneena<br/>{this.getKadonnut()}</p>}
          </div>
        </div>
      </div>
    </div>
  }

}

GridItem.defaultProps = {interval: 0};
export default GridItem;