import React from 'react';

import ExpiryBlock from '../components/notifications/expiry/ExpiryBlock';
import QuantityBlock from '../components/notifications/quantity/QuantityBlock';


const NotificationPage = ()=>{
    return(
        <div className="mainpage">
                <ExpiryBlock />
                <QuantityBlock />
        </div>
    )
}

export default NotificationPage;