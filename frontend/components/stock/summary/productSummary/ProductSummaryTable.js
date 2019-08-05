import React from 'react';


const ProductSummaryTable = (props)=>{
    const {sr,createdAt,badgeNumber,noofpieces,buyPrice,sellPrice,wholeSalePrice,expiry} = props;
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
        </tr>
    );
}

export default ProductSummaryTable;