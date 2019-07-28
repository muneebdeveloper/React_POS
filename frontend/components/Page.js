import React, {Component} from 'react';
import Meta from './Meta';

import Header from './Header/Header';


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