import React, {Component} from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import styles from './EditDialog.css';


const SubmitStock  = (props)=>{

    const {
        totalBuyPrice,
        supplier_description,
        supplier_amountpaid,
        supplier_name,
        submitStockHandler,
        prochangeHandler
    } = props;

    return(
        <form className={styles.editDialogMargin} onSubmit={submitStockHandler}>

            <h2>Amount to pay: {totalBuyPrice}</h2>
            <h3>Supplier Name:{supplier_name}</h3>
            <TextField
                label="Description"
                variant="outlined"
                type="text"
                name="supplier_description"
                value={supplier_description}
                onChange={prochangeHandler}
                fullWidth
            />

            <TextField
                label="Amount paying"
                variant="outlined"
                type="number"
                name="supplier_amountpaid"
                value={supplier_amountpaid}
                onChange={prochangeHandler}
                required
                fullWidth
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

export default SubmitStock;