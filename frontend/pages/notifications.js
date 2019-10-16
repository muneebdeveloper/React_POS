import React from 'react';

import PleaseSignIn from '../components/PleaseSignIn';
import ExpiryBlock from '../components/notifications/expiry/ExpiryBlock';
import QuantityBlock from '../components/notifications/quantity/QuantityBlock';


const NotificationPage = ()=>{
    return(
        <div className="mainpage">
            <PleaseSignIn>
                <ExpiryBlock />
                <QuantityBlock />
            </PleaseSignIn>
        </div>
    )
}

export default NotificationPage;