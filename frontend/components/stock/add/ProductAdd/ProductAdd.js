import React,{Component} from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';


import styles from './ProductAdd.css';



class ProductAdd extends Component{
    

      render(){  const { prochangeHandler,
                stockChangeHandler,
                productname,
                badge,
                buyprice,
                sellprice,
                wholesaleprice,
                noofpieces,
                expiry,
                submitDisabled
              } = this.props;

        return(
            
                        <form onSubmit={stockChangeHandler}>
                        <div className={styles.maingrid}>
                        <TextField 
                            label="Product Name"
                            variant="outlined"
                            type="text"
                            value={productname}
                            disabled
                        />
        
                        <TextField
                            label="Badge Number"
                            variant="outlined"
                            type="text"
                            name="badge"
                            value={badge}
                            autoFocus={productname ? true:false}
                            onChange={prochangeHandler}
                        />
        
                        <TextField
                            label="Buy Price"
                            variant="outlined"
                            type="number"
                            name="buyprice"
                            value={buyprice}
                            onChange={prochangeHandler}
                            required
                        />
        
                        <TextField
                            label="Sell Price"
                            variant="outlined"
                            type="number"
                            name="sellprice"
                            value={sellprice}
                            onChange={prochangeHandler}
                            required
                        />
        
                        <TextField
                            label="wholesale Price"
                            variant="outlined"
                            type="number"
                            name="wholesaleprice"
                            value={wholesaleprice}
                            onChange={prochangeHandler}
                            required
                        />
        
                        <TextField
                            label="Number of Pieces"
                            variant="outlined"
                            type="number"
                            name="noofpieces"
                            value={noofpieces}
                            onChange={prochangeHandler}
                            required
                        />

                        <TextField 
                            label="expiry"
                            name="expiry"
                            value={expiry}
                            type="date"
                            InputLabelProps={{
                                shrink:true
                            }}
                            onChange={prochangeHandler}
                        />

                        
                    </div>
        
                    <DialogActions>
                        <Button 
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={submitDisabled}
                            >
                                Create Stock
                            </Button>
                    </DialogActions>
                        
                    </form>
                    );
                        }

    }



export default ProductAdd;