import React from 'react';

import Button from '@material-ui/core/Button';

import styles from './tickettable.css';

const Refund_By_Ticket_Table = (props)=>{
    const { id,
            index, 
            name, 
            quantity,
            refundByQuantity,
            refundAll,
        } = props;
        
    return(
        <tr>
            <td>{index+1}</td>
            <td>{name}</td>
            <td>{quantity}</td>
            <td>
                <div className={styles.buttonstyle}>
                    <Button 
                        size="small"
                        variant="contained"
                        onClick={()=>refundByQuantity(index)}
                        disabled={quantity<=0}
                    >Refund
                    </Button>
                    <Button
                    size="small"
                        variant="contained"
                        onClick={()=>refundAll(index,id)}
                        disabled={quantity<=0}
                    >Refund All
                    </Button>
                </div>
            </td>
        </tr>
    )
}

export default Refund_By_Ticket_Table;