import React from 'react';

import PleaseSignIn from '../components/PleaseSignIn';
import Suppliers_ed from '../components/suppliers/editandremove/Suppliers_ed';

const Suppliers_ed_page = ()=>{
    return(
        <div className="mainpage">
            <PleaseSignIn>
                <Suppliers_ed />
            </PleaseSignIn>
        </div>
    );
}


export default Suppliers_ed_page;