import React from 'react';
import Page from './page.jsx';
const Home = (props) => {
  console.log('home - props', props);
  return (
    <Page title="Tule etsimään kadonneita ihmisiä">
       <div> 
        <div dangerouslySetInnerHTML={{__html: props.params.description}} />
          <blockquote className="blockquote-reverse">
            <p>{props.params.quotetext}</p>
            <footer>{props.params.quoteauthor}</footer> 
          </blockquote>
        </div>   
    </Page>
  )
 
};

export default Home;

