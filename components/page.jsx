import React from 'react';
const Page = props => {
  return (
    <div className="row">
      <div className="col-md-8 col-md-offset-2">
        <div className="content center-block text-center">
          <div className="page-header">
            <h1>{props.title}</h1>
          </div>
          {props.children}
        </div> 
       </div>
    </div>
  )    

};

export default Page;
