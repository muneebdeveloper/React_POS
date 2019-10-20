import React from 'react';

import Intro from '../components/misc/Intro';

import Quantity_Notifications from '../components/notifications/quantity/Quantity_Notifications';


const QuantityNotificationsPage = ()=>{
    return(
        <div className="mainpage">
            <Intro>
                Quantity Details
            </Intro>
                <Quantity_Notifications />
        </div>
    )
}

export default QuantityNotificationsPage;