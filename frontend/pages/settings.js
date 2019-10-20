import React from 'react';

import ExpirySettings from '../components/settings/expiry/ExpirySettings';
import QuantitySettings from '../components/settings/quantity/QuantitySettings';


const SettingsPage = ()=>{

    
        return(
            <div className="mainpage">
                <ExpirySettings />
                <QuantitySettings />
            </div>
        )
    
}



export default SettingsPage;