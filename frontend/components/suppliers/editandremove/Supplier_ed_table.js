import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';

import styles from './Supplier_ed_table.css';


const Supplier_ed_table = (props)=>{
    const {id,sr,name,phone,address} = props;
    return(
        <tr>
            <td>{sr}</td>
            <td>{name}</td>
            <td>{phone}</td>
            <td>{address}</td>
            <td>
                <IconButton size="small" onClick={()=>alert(id)}>
                    <Edit className={styles.edit} />
                </IconButton>

                <IconButton size="small"  >
                    <Delete className={styles.delete} />
                </IconButton>
                              
            </td>
         </tr>
    );
}

export default Supplier_ed_table;