import React from 'react';


const Add_Expense_Detail = (props)=>{
    const {sr,description,amount} = props;
    return(
        <tr>
            <td>{sr}</td>
            <td>{description}</td>
            <td>{amount}</td>
        </tr>
    )
}

export default Add_Expense_Detail;