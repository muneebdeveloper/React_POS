import React from 'react';

import AddSuppliers from '../components/suppliers/add/AddSuppliers';
import EditAndRemoveSuppliers from '../components/suppliers/editandremove/EditAndRemoveSuppliers';
import CashManage from '../components/suppliers/cashManage/CashManage';

const SuppliersPage = ()=>{

    return(
        <div className="mainpage">
            <AddSuppliers />
            <EditAndRemoveSuppliers />
            <CashManage />
        </div>
    );
}

export default SuppliersPage;