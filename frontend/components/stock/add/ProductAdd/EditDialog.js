import React, {Component} from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import styles from './EditDialog.css';

class EditDialog extends Component{

    
    render(){
        let
        { 
        prochangeHandler,
        editUpdateHandler,
        productname,
        badge,
        buyprice,
        sellprice,
        wholesaleprice,
        noofpieces,
        expiry
      } = this.props;

      expiry= expiry.split("T").shift();
      console.log(expiry);

        return(
       <form className={styles.editDialogMargin} onSubmit={editUpdateHandler}>  
        <TextField
            label="Badge Number"
            variant="outlined"
            type="text"
            name="editbadge"
            value={badge}
            autoFocus={productname?true:false}
            onChange={prochangeHandler}
            fullWidth
        />

        <TextField
            label="Buy Price"
            variant="outlined"
            type="number"
            name="editbuyprice"
            value={buyprice}
            onChange={prochangeHandler}
            required
            fullWidth
        />

        <TextField
            label="Sell Price"
            variant="outlined"
            type="number"
            name="editsellprice"
            value={sellprice}
            onChange={prochangeHandler}
            required
            fullWidth
        />

        <TextField
            label="wholesale Price"
            variant="outlined"
            type="number"
            name="editwholesaleprice"
            value={wholesaleprice}
            onChange={prochangeHandler}
            required
            fullWidth
        />

        <TextField
            label="Number of Pieces"
            variant="outlined"
            type="number"
            name="editnoofpieces"
            value={noofpieces}
            onChange={prochangeHandler}
            required
            fullWidth
        />

        <TextField 
            label="expiry"
            name="editexpiry"
            value={expiry}
            type="date"
            InputLabelProps={{
                shrink:true
            }}
            fullWidth
            onChange={prochangeHandler}
        />

        <Button 
            type="submit"
            variant="contained"
            size="large"
            fullWidth
        >
            Submit
        </Button>
    </form>
        )
    }
}

export default EditDialog;