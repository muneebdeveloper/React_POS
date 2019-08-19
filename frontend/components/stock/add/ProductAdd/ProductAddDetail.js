import React, {Component} from 'react';

import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';

import styles from './index.css';

class ProductAddDetail extends Component{


    render(){
        const { id,
                index,
                productname,
                badge,
                buyprice,
                sellprice,
                wholesaleprice,
                noofpieces,
                expiry,
                dialogHandlerEdit,
                dialogHandlerRemove
              } = this.props;
        return(
           <tr>
               <td>{productname}</td>
               <td>{badge}</td>
               <td>{buyprice}</td>
               <td>{sellprice}</td>
               <td>{wholesaleprice}</td>
               <td>{noofpieces}</td>
               <td>{expiry}</td>
               <td style={{textAlign:"center"}}>
                <IconButton size="small" onClick={dialogHandlerEdit.bind(this,id,index)}>
                    <Edit className={styles.edit} />
                </IconButton>

                <IconButton size="small" onClick={dialogHandlerRemove.bind(this,id,index)}>
                    <Delete className={styles.delete} />
                </IconButton>
                              
            </td>
           </tr>

        );
    }
}

export default ProductAddDetail;