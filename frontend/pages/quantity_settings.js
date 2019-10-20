import React from 'react';

import Intro from '../components/misc/Intro';


import Quantity_Settings from '../components/settings/quantity/Quantity_Settings';


const QuantitySettingsPage = ()=>{
    return(
        <div className="mainpage">
            <Intro>
                Expiry Settings
            </Intro>
                <Quantity_Settings />
        </div>
    )
}

export default QuantitySettingsPage;