import React from 'react';

const Manage_Cash_Summary_Table = (props)=>{

    const { sr,
            createdAt,
            description,
            amounttopay,
            amountpaid,
            amountlefttopay,
            amounttotake,
            amounttaken,
            amountlefttotake
        } = props;
    return(
        <tr>
            <td>{sr}</td>
            <td>{createdAt}</td>
            <td>{description}</td>
            <td>{amounttopay}</td>
            <td>{amountpaid}</td>
            <td>{amountlefttopay}</td>
            <td>{amounttotake}</td>
            <td>{amounttaken}</td>
            <td>{amountlefttotake}</td>
         </tr>
        
    )
}

export default Manage_Cash_Summary_Table;