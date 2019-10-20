import React from 'react';

import Intro from '../components/misc/Intro';

import PleaseSignIn from '../components/PleaseSignIn';
import Quantity_Notifications from '../components/notifications/quantity/Quantity_Notifications';


const QuantityNotificationsPage = ()=>{
    return(
        <div className="mainpage">
            <PleaseSignIn>
            <Intro>
                Quantity Details
            </Intro>
                <Quantity_Notifications />
            </PleaseSignIn>
        </div>
    )
}

export default QuantityNotificationsPage;