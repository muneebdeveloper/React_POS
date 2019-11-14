import React, {Component} from 'react';
import {Mutation} from 'react-apollo';

import {STOCKITEM_UPDATE_MUTATION} from '../../add/ProductAdd/index';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import styles from './EditDialog.css';

class EditDialog extends Component{

    state = {
        badge:'',
        buyprice:'',
        sellprice:'',
        wholesaleprice:'',
        noofpieces:'',
        expiry:''
    }

    componentDidMount(){

        let
        {   
            id,
            badge,
            buyprice,
            sellprice,
            wholesaleprice,
            noofpieces,
            expiry
        } = this.props;

        this.setState({
            id,
            badge,
            buyprice,
            sellprice,
            wholesaleprice,
            noofpieces,
            expiry
        });

    }

    inputChangeHandler = (e)=>{

        this.setState({
            [e.target.name]:e.target.value
        });

    }

    editFormHandler = (updateStockItem)=>async (e)=>{
        e.preventDefault();
        await updateStockItem();
        this.props.dialogClose();
    }

    
    render(){
       
            let
            { 
                badge,
                buyprice,
                sellprice,
                wholesaleprice,
                noofpieces,
                expiry
            } = this.state;
           
        if(expiry){
            expiry= expiry.split("T").shift();
        }
        
      

        return(
            <Mutation
                mutation={STOCKITEM_UPDATE_MUTATION}
                variables={{
                    id:this.state.id,
                    badgeNumber:badge,
                    noofpieces:Number(noofpieces),
                    buyPrice:Number(buyprice),
                    sellPrice:Number(sellprice),
                    wholesalePrice:Number(wholesaleprice),
                    expiry
                }}
            >
                {
                    (updateStockItem,{loading})=>{

                        if(loading){
                            return(
                                <div className="dialogLoadingStyle">
                                    <CircularProgress size={70} />
                                </div>
                            );
                        }

                        return(
                            <form className={styles.editDialogMargin} onSubmit={this.editFormHandler(updateStockItem)}>  
                                <TextField
                                    label="Badge Number"
                                    variant="outlined"
                                    type="text"
                                    name="badge"
                                    value={badge}   
                                    onChange={this.inputChangeHandler}
                                    fullWidth
                                    autoFocus
                                />

                                <TextField
                                    label="Buy Price"
                                    variant="outlined"
                                    type="number"
                                    name="buyprice"
                                    value={buyprice}
                                    onChange={this.inputChangeHandler}
                                    required
                                    fullWidth
                                />

                                <TextField
                                    label="Sell Price"
                                    variant="outlined"
                                    type="number"
                                    name="sellprice"
                                    value={sellprice}
                                    onChange={this.inputChangeHandler}
                                    required
                                    fullWidth
                                />

                                <TextField
                                    label="wholesale Price"
                                    variant="outlined"
                                    type="number"
                                    name="wholesaleprice"
                                    value={wholesaleprice}
                                    onChange={this.inputChangeHandler}
                                    required
                                    fullWidth
                                />

                                <TextField
                                    label="Number of Pieces"
                                    variant="outlined"
                                    type="number"
                                    name="noofpieces"
                                    value={noofpieces}
                                    onChange={this.inputChangeHandler}
                                    required
                                    fullWidth
                                />

                                <TextField 
                                    label="expiry"
                                    name="expiry"
                                    value={expiry}
                                    type="date"
                                    InputLabelProps={{
                                        shrink:true
                                    }}
                                    fullWidth
                                    onChange={this.inputChangeHandler}
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
                        );
                    }
                }
            </Mutation>
        )
    }
}

export default EditDialog;