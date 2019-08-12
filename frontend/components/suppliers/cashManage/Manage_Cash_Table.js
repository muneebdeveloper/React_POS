import React from 'react';

const Manage_Cash_Table = (props)=>{

    const {id,sr,name,phone,address,rowClickHandler} = props;
    return(
        <tr onClick={()=>rowClickHandler(id,name)}>
            <td>{sr}</td>
            <td>{name}</td>
            <td>{phone}</td>
            <td>{address}</td>
         </tr>
        
    )
}

export default Manage_Cash_Table;