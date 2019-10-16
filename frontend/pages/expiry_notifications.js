import React from 'react';

import Intro from '../components/misc/Intro';

import PleaseSignIn from '../components/PleaseSignIn';
import Expiry_Notifications from '../components/notifications/expiry/Expiry_Notifications';


const ExpiryNotificationsPage = ()=>{
    return(
        <div className="mainpage">
            <PleaseSignIn>
            <Intro>
                Expiry Details
            </Intro>
                <Expiry_Notifications />
            </PleaseSignIn>
        </div>
    )
}

export default ExpiryNotificationsPage;