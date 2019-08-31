import React from 'react';

import PleaseSignIn from '../components/PleaseSignIn';
import Manage_Cash from '../components/suppliers/cashManage/Manage_Cash';

const Supplier_Manage_Cash_Page = ()=>{

    return(
        <div className="mainpage">
            <PleaseSignIn>
                <Manage_Cash />
            </PleaseSignIn>
        </div>
    );

}

export default Supplier_Manage_Cash_Page;