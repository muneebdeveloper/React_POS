import React, {Component} from 'react';
import Meta from './Meta';
import Router from 'next/router';
import Header from './Header/Header';
import NProgress from 'nprogress';
import PleaseSignIn from './PleaseSignIn';
Router.onRouteChangeStart = ()=>{
  NProgress.start();
}

Router.onRouteChangeComplete = ()=>{
  NProgress.done();
}



// Router.events.on('routeChangeComplete', () => {
//   if (process.env.NODE_ENV !== 'production') {
//     const els = document.querySelectorAll('link[href*="/_next/static/css/styles.chunk.css"]');
//     const timestamp = new Date().valueOf();
//     els[0].href = '/_next/static/css/styles.chunk.css?v=' + timestamp;
//   }
// })

class Page extends Component{

    render(){

        return(
            <React.Fragment>
                <Meta />
                <div className="container">
                    <Header />
                    <PleaseSignIn>
                        {this.props.children}
                    </PleaseSignIn>
                </div>
            </React.Fragment>
        );

    }

}

export default Page;