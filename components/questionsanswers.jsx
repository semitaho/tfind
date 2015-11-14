import React from 'react';

const UKKForm = (props) => {
  return <dl>{props.items.map(item => {
      return (<div className="lead">
              <dt>{item.jnro}. {item.question}</dt>
              <dd>{item.answer}</dd>
            </div>
    )
    })
    }
  </dl>
};

export default UKKForm;