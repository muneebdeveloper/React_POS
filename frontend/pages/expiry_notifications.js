import React from 'react';

import Intro from '../components/misc/Intro';

import Expiry_Notifications from '../components/notifications/expiry/Expiry_Notifications';


const ExpiryNotificationsPage = ()=>{
    return(
        <div className="mainpage">
            <Intro>
                Expiry Details
            </Intro>
                <Expiry_Notifications />
        </div>
    )
}

export default ExpiryNotificationsPage;