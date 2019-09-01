import React, {Component} from 'react';
import Meta from './Meta';
import Router from 'next/router';
import Header from './Header/Header';
import NProgress from 'nprogress';

Router.onRouteChangeStart = ()=>{
  NProgress.start();
}

Router.onRouteChangeComplete = ()=>{
  NProgress.done();
}

class Page extends Component{

    render(){

        return(
            <React.Fragment>
                <Meta />
                <div className="container">
                    <Header />
                        {this.props.children}
                </div>
            </React.Fragment>
        );

    }

}

export default Page;