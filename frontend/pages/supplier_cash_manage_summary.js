import React from 'react';

import PleaseSignIn from '../components/PleaseSignIn';
import Supplier_Manage_Cash_Summary from '../components/suppliers/cashManage/Manage_Cash_Summary';


const Supplier_Manage_Cash_Summary_Page = (props)=>{

    return(
        <div className="mainpage">
            <PleaseSignIn>
                <Supplier_Manage_Cash_Summary id={props.query.id} />
            </PleaseSignIn>
        </div>
    );

}

export default Supplier_Manage_Cash_Summary_Page;