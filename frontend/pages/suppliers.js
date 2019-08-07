import React from 'react';

import AddSuppliers from '../components/suppliers/add/AddSuppliers';
import EditAndRemoveSuppliers from '../components/suppliers/editandremove/EditAndRemoveSuppliers';

const SuppliersPage = ()=>{

    return(
        <div className="mainpage">
            <AddSuppliers />
            <EditAndRemoveSuppliers />
        </div>
    );
}

export default SuppliersPage;