import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import styles from '../../../main.css';

const ProductSummaryTable = (props)=>{
    const {
        sr,
        id,
        index,
        createdAt,
        badgeNumber,
        noofpieces,
        buyPrice,
        sellPrice,
        wholeSalePrice,
        expiry,
        dialogHandlerEdit,
        dialogHandlerRemove
    } = props;
    return(
        <tr>
            <td>{sr}</td>
            <td>{createdAt}</td>
            <td>{badgeNumber}</td>
            <td>{noofpieces}</td>
            <td>{buyPrice}</td>
            <td>{sellPrice}</td>
            <td>{wholeSalePrice}</td>
            <td>{expiry}</td>
            <td style={{textAlign:"center"}}>
                <IconButton 
                    size="small"
                    onClick={dialogHandlerEdit.bind(this,index)}
                >
                    <EditIcon className={styles.edit} />
                </IconButton>

                <IconButton 
                    size="small"
                    onClick={dialogHandlerRemove.bind(this,id)}
                >
                    <DeleteIcon className={styles.delete} />
                </IconButton>
                              
            </td>
        </tr>
    );
}

export default ProductSummaryTable;