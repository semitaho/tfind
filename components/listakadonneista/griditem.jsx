import React from 'react';
import {Button, Carousel, CarouselItem} from 'react-bootstrap';
import FindingForm from './../findingform.jsx';
import KadonnutNews from './../kadonnutNews.jsx';
import TextFormatter from './../../utils/textformatter.js';
class GridItem extends React.Component {

  constructor() {
    super();
    this.state = {current: 0, kadonnutTime: 0, showmodal: false};
    this.onModalOpen = this.onModalOpen.bind(this);
    this.onFormOpen = this.onFormOpen.bind(this);

    this.onModalClose = this.onModalClose.bind(this);
    this.onFormClose = this.onFormClose.bind(this);

    this.onKadonnutTimeout = this.onKadonnutTimeout.bind(this);
    this.onNewsOpen = this.onNewsOpen.bind(this);
    this.onNewsHide = this.onNewsHide.bind(this);

  }

  componentDidMount() {
    if (this.props.item && this.props.item.lost) {
      this.kadonnutInterval = setInterval(() => this.props.receiveTimeout(new Date()) , 1000);
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
    let timeout = this.props.item.timeout;
    var kadonnutTime = timeout.getTime() - this.props.item.lost.timestamp;
    return this.formatToTime(kadonnutTime);
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
              <Button bsStyle="info" onClick={() => this.props.onHavainnotClick(item)}>Havainnot kartalla
                ({this.props.item.findings.length})</Button>
              <Button bsStyle="info" onClick={this.onNewsOpen}>Uutiset henkilöstä {item.name}</Button>
              <Button bsStyle="success" onClick={self.onFormOpen}>Ilmoita havainnosta</Button>
            </div>
            {!item.timeout ? '' : <p className="text-primary">Kadonneena<br/>{this.onKadonnutTimeout()}</p>}
          </div>
        </div>
      </div>
    </div>
  }

}

GridItem.defaultProps = {interval: 0};
export default GridItem;