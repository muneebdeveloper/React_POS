import React, {Component} from 'react';


class ProductAddDetail extends Component{


    render(){
        const {productname,badge,buyprice,sellprice,wholesaleprice,noofpieces,expiry} = this.props;
        return(
           <tr>
               <td>{productname}</td>
               <td>{badge}</td>
               <td>{buyprice}</td>
               <td>{sellprice}</td>
               <td>{wholesaleprice}</td>
               <td>{noofpieces}</td>
               <td>{expiry}</td>
           </tr>

        );
    }
}

export default ProductAddDetail;