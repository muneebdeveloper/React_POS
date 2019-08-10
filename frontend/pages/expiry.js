import React from 'react';

import ExpiryDefine from '../components/expiry/define/ExpiryDefine';
import ExpiryAdd from '../components/expiry/add/ExpiryAdd';

const ExpiryPage = ()=>{

    return(
        <div className="mainpage">
            <ExpiryDefine />
            <ExpiryAdd />
        </div>
    );
}


export default ExpiryPage;