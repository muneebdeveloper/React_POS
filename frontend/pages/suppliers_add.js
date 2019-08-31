import React from 'react';

import PleaseSignIn from '../components/PleaseSignIn';
import Suppliers_Add from '../components/suppliers/add/Suppliers_Add';


const Suppliers_Add_Page = ()=>{
    return(
        <div className="mainpage">
            <PleaseSignIn>
                <Suppliers_Add />
            </PleaseSignIn>
        </div>
    );
}

export default Suppliers_Add_Page;