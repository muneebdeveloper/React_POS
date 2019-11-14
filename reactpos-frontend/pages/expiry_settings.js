import React from 'react';

import Intro from '../components/misc/Intro';


import Expiry_Settings from '../components/settings/expiry/Expiry_Settings';


const ExpirySettingsPage = ()=>{
    return(
        <div className="mainpage">
            <Intro>
                Expiry Settings
            </Intro>
                <Expiry_Settings />
        </div>
    )
}

export default ExpirySettingsPage;