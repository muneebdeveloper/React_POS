import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';


const Add_Expense_Detail = (props)=>{
    const {sr,description,amount} = props;
    return(
        <tr>
            <td>{sr}</td>
            <td>{description}</td>
            <td>{amount}</td>
            <td style={{textAlign:"center"}}>
                <IconButton size="small"  >
                    <Edit className={styles.edit} />
                </IconButton>

                <IconButton size="small" >
                    <Delete className={styles.delete} />
                </IconButton>
                              
            </td>
        </tr>
    )
}

export default Add_Expense_Detail;