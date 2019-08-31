import React from 'react';

import PleaseSignIn from '../components/PleaseSignIn';
import ExpiryAdd from '../components/expiry/add/ExpiryAdd';

const ExpiryPage = ()=>{

    return(
        <div className="mainpage">
            <PleaseSignIn>
                <ExpiryAdd />
            </PleaseSignIn>
        </div>
    );
}


export default ExpiryPage;