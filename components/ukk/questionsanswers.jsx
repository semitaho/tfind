import React from 'react';
import Page from './../page.jsx';
import { connect } from 'react-redux'

class UKKForm extends React.Component {

  constructor(){
    super();
  }
  render() {
    return <Page title="Usein kysyttyjä kysymyksiä">
              <dl className="text-left">{this.props.items.map((item,id) => {
                return (<div key={id} className="lead">
                          <dt>{item.jnro}. {item.question}</dt>
                          <dd>{item.answer}</dd>
                        </div>
                        )
                  })
            }</dl>
            </Page>
  }
}
const mapStateToProps = state => {
  return {
    items : state.ukkstate.items
  };
};



export default connect(mapStateToProps)(UKKForm);