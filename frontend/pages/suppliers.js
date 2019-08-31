import React from 'react';

import PleaseSignIn from '../components/PleaseSignIn';
import AddSuppliers from '../components/suppliers/add/AddSuppliers';
import EditAndRemoveSuppliers from '../components/suppliers/editandremove/EditAndRemoveSuppliers';
import CashManage from '../components/suppliers/cashManage/CashManage';

const SuppliersPage = ()=>{

    return(
        <div className="mainpage">
            <PleaseSignIn>
                <AddSuppliers />
                <EditAndRemoveSuppliers />
                <CashManage />
            </PleaseSignIn>
        </div>
    );
}

export default SuppliersPage;