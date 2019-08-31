import React from 'react';

import PleaseSignIn from '../components/PleaseSignIn';
import Add_Expiry from '../components/expiry/add/Add_Expiry';


const Add_Expiry_Page = ()=>{

    return(
        <div className="mainpage">
            <PleaseSignIn>
                <Add_Expiry />
            </PleaseSignIn>
        </div>
    );

}

export default Add_Expiry_Page;