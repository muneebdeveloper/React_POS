import React from 'react';

const Manage_Cash_Summary_Table = (props)=>{

    const { sr,
            createdAt,
            description,
            amountpaid,
            amounttaken,
        } = props;
    return(
        <tr>
            <td>{sr}</td>
            <td>{createdAt}</td>
            <td>{description}</td>
            <td>{amountpaid}</td>
            <td>{amounttaken}</td>
         </tr>
        
    )
}

export default Manage_Cash_Summary_Table;