import React from 'react';


const Summary_Expense_Detail = (props)=>{

    let{
        sr,
        createdAt,
        description,
        amount
    }=props;
    createdAt = createdAt.split("T").shift().split("-").reverse().join("-");

    return(
        <tr>
            <td>{sr}</td>
            <td>{createdAt}</td>
            <td>{description}</td>
            <td>{amount}</td>
        </tr>
    );
}

export default Summary_Expense_Detail;