import React from 'react';
import Page from './page.jsx';
class UKKForm extends React.Component {

  constructor(){
    super();
  }
  render() {

    return <Page title="Usein kysyttyjä kysymyksiä">
              <dl>{this.props.params.items.map(item => {
                return (<div className="lead">
                          <dt>{item.jnro}. {item.question}</dt>
                          <dd>{item.answer}</dd>
                        </div>
                        )
                  })
            }</dl>
            </Page>
  }
}

export default UKKForm;