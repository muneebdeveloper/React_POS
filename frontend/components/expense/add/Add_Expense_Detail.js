import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';

import styles from './Add_Expense.css';

const Add_Expense_Detail = (props)=>{
    const {
            id,
            sr,
            index,
            description,
            amount,
            editDialogHandler,
            removeDialogHandler
        } = props;
        
    return(
        <tr>
            <td>{sr}</td>
            <td>{description}</td>
            <td>{amount}</td>
            <td style={{textAlign:"center"}}>
                <IconButton size="small" onClick={editDialogHandler.bind(this,id,index)} >
                    <Edit className={styles.edit} />
                </IconButton>

                <IconButton size="small" onClick={removeDialogHandler.bind(this,id,index)} >
                    <Delete className={styles.delete} />
                </IconButton>
                              
            </td>
        </tr>
    )
}

export default Add_Expense_Detail;