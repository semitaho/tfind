import React from 'react';
import {Modal} from 'react-bootstrap';

class KadonnutNews extends React.Component {
  constructor() {
    super();
    this.state = {data: []};
  }

  render() {
    return (
      <Modal id="news-modal" show={true} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Uutisia henkilöstä {this.props.item.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.data && this.state.data.length > 0 ? <div>{this.state.data.map(dataitem => {
            return <p><span dangerouslySetInnerHTML={{__html: dataitem.message}} /></p>
          })}</div> : ''}

        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    )
  }

  componentDidMount() {
    FB.api('/Kadoksissa.fi/feed', (response) => {
      console.log('response', response);
      if (response.data) {
        let filteredData = response.data.filter(item => {
          if (!item.message){
            return false;
          }
          let filteredName = this.props.item.name.toLowerCase();
          let text = item.message.toLowerCase();
          if (text.indexOf(filteredName) > -1) {
            return true;
          }
          return false;

        });
        this.setState({data: filteredData});

      }

    });
  }

}

export default KadonnutNews;

