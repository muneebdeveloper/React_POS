import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';

import styles from './RetailSales.css';

const RetailSales_Table = (props)=>{
    const {
        id,
        sr,
        product,
        price,
        quantity,
        value,
        productQuantityDialogHandler
    }=props;
    return(
        <tr>
            <td>{sr}</td>
            <td>{product}</td>
            <td>{price}</td>
            <td>{quantity}</td>
            <td>{value}</td>
            <td style={{textAlign:"center"}}>
                <IconButton size="small"  onClick={productQuantityDialogHandler.bind(this)} >
                    <Edit className={styles.edit} />
                </IconButton>

                <IconButton size="small" >
                    <Delete className={styles.delete} />
                </IconButton>
                              
            </td>
        </tr>
    )
}

export default RetailSales_Table;

// onClick={dialogHandlerRemove.bind(this,id,index)}