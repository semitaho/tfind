import React from 'react';

import {Button} from 'react-bootstrap';

const Next = (props) => {

  return <div className="btn-group pull-right"><Button onClick={props.onClick} disabled={props.disabled} bsStyle="success">Seuraava</Button></div>
};

export default Next;