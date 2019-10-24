import React from 'react';


const StockAuditTable = (props)=>{

    const {
        sr,
        name,
        barcode,
        quantity,
        sellPrice,
        wholesalePrice
    } = props;
    return(
        <tr>
            <td>{sr}</td>
            <td>{name}</td>
            <td>{barcode}</td>
            <td>{quantity}</td>
            <td>{sellPrice}</td>
            <td>{wholesalePrice}</td>
        </tr>
    );
}

export default StockAuditTable;