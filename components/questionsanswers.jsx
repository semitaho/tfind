import React from 'react';

class UKKForm extends React.Component {

  constructor(){
    super();
  }
  render() {
    return <dl>{this.props.items.map(item => {
      return (<div className="lead">
          <dt>{item.jnro}. {item.question}</dt>
          <dd>{item.answer}</dd>
        </div>
      )
    })
    }
    </dl>
  }
}

export default UKKForm;