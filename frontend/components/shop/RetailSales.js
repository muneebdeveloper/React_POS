import React, {Component} from 'react';
import {ApolloConsumer} from 'react-apollo';
import gql from 'graphql-tag';

import Intro from '../misc/Intro';
import SnackBar from '../misc/SnackBar';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Search from '@material-ui/icons/Search';
import Delete from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import PanTool from '@material-ui/icons/PanTool';
import ShoppingCart from '@material-ui/icons/ShoppingCart'

import styles from './RetailSales.css';
import RetailSales_Table from './RetailSales_Table';

const PRODUCT_SELLPRICE_QUERY = gql`
    query PRODUCT_SELLPRICE_QUERY($barcode:String!){
        product(where:{barcode:$barcode}){
            id
            name
            sellPrice
        }
    }
`;

const CREATE_SALESTICKET_MUTATION = gql`
    mutation CREATE_SALESTICKET_MUTATION{
        createSalesTicket{
            receipt
        }
    }
`;

const CREATE_SALESITEM_MUTATION = gql`
    mutation CREATE_SALESITEM_MUTATION($noofpieces:Int!,$sellPrice:Float!,$id:ID!,$receipt:String!){
        createSalesItem(data:{
            noofpieces:$noofpieces,
            sellPrice:$sellPrice,
            product:{
                connect:{
                    id:$id
                }
            },
            salesTicket:{
                connect:{
                    receipt:$receipt
                }
            }
        }){
            profit
        }
    }
`;


class RetailSales extends Component{

    constructor(props){
        super(props);

        this.inputFieldRef = React.createRef();
    }

    state={
        barcode:'',
        receipt:[],
        snackbarOpen:false,
        edit_quantity:'',
        snackbarMessage:'',
        subTotal:function(){
            let totalValue=0;
            this.receipt.map((t)=>{
                totalValue = totalValue + t.value();
            });
            return totalValue;
        },
        discount:0,
        productQuantityDialogOpen:false
    }

    componentDidMount(){
        this.inputFieldRef.current.focus();
        
    }

    inputChangeHandler = (e)=>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    barcodeSubmitForSellPrice = (client)=>async (e)=>{
        e.preventDefault();
        const res = await client.query({
            query:PRODUCT_SELLPRICE_QUERY,
            variables:{
                barcode:this.state.barcode
            }
        });
        if(res.data.product){
            const {id,name,sellPrice} = res.data.product;
            if(sellPrice){
                let foundIndex,receiptObject;
                foundIndex = this.state.receipt.findIndex((arr)=>id===arr.id);
                if(foundIndex==-1){
                    receiptObject = {
                        id,
                        product:name,
                        price:sellPrice,
                        quantity:1,
                        value:function(){return this.quantity*this.price}
                    }
                    this.setState((state)=>{
                        state.receipt.push(receiptObject);
                        return{
                            barcode:''
                        }
                       
                    })
                    this.inputFieldRef.current.focus();
                }
                else{
                    this.setState((state)=>{
                            state.receipt[foundIndex].quantity++;
                            return{
                                barcode:''
                            }
                        
                    })
                    this.inputFieldRef.current.focus();
                }
            }else{
                this.setState({
                    snackbarOpen:true,
                    snackbarMessage:"The stock doesnot exist",
                    barcode:''
                })
                this.inputFieldRef.current.focus();
            }
        }
        if(!res.data.product){
                this.setState({
                    snackbarOpen:true,
                    snackbarMessage:"The Product doesnot exist",
                    barcode:''
                });
                this.inputFieldRef.current.focus();
        }
    }

    productRemoveHandler = (index)=>{
        this.setState((state)=>{
            state.receipt.splice(index,1);
            return{
            }
        });
    }

    productQuantityHandler = (e)=>{
        e.preventDefault();
        let {receipt,edit_index,edit_quantity} = this.state;
        let productObject = receipt[edit_index];
        productObject.quantity=edit_quantity;
        this.setState((state)=>{
            state.receipt[state.edit_index]=productObject;
            return{
                productQuantityDialogOpen:false,
                edit_quantity:''
            }
        })
    }

    printReceiptHandler = (client)=>async ()=>{
        const res= await client.mutate({
            mutation:CREATE_SALESTICKET_MUTATION
        });
        const salesTicket = res.data.createSalesTicket.receipt;
        this.state.receipt.map((r)=>{
            const {id,price,quantity} = r;
            client.mutate({
                mutation:CREATE_SALESITEM_MUTATION,
                variables:{
                    noofpieces:Number(quantity),
                    sellPrice:Number(price),
                    id:id,
                    receipt:salesTicket
                }
            });
        });
    }

    render(){
        const {
            barcode,
            receipt,
            snackbarOpen,
            edit_quantity,
            discount,
            snackbarMessage,
            productQuantityDialogOpen
        } = this.state;

        return(
            <>
            <Intro>
                Retail Sales
            </Intro>
            <div className={`gutterbottom ${styles.maintoolbar}`}>
            <ApolloConsumer>
                {
                    (client)=>{
                        return(
                            <form onSubmit={this.barcodeSubmitForSellPrice(client)}>
                                <div className={styles.mainfirst}>
                                    
                                <TextField 
                                    label="Product Code"
                                    variant="outlined"
                                    value={barcode}
                                    name="barcode"
                                    inputRef={this.inputFieldRef}
                                    onChange={this.inputChangeHandler}
                                    className={styles.mainfirstgrow}
                                />
                                <Button
                                    variant="contained"
                                    type="submit"
                                >
                                        submit
                                    </Button>
                                </div>
                            </form>
                        )
                    }
                }
            </ApolloConsumer>
          
                <div className={styles.mainsecond}>
                <Button
                    variant="contained"
                    >
                        <Search className={styles.marginRight} />
                        Search Product
                    </Button>
                    <Button
                    variant="contained"
                    >
                        <PanTool className={styles.marginRight} />
                        Hold Receipt
                    </Button>

                    <Button
                    variant="contained"
                    >
                        
                        <Badge badgeContent={2} color="secondary">
                            <ShoppingCart className={styles.marginRight} />
                        </Badge> 
                        
                       
                           
                        Holded Receipt
                    </Button>

                    <Button
                    variant="contained"
                    className={styles.red}
                    >
                        <Delete />
                        Delete Receipt
                    </Button>
                    </div>

            </div>
            <div style={{height:"301px",overflowY:"auto",border:"2px solid black"}} className="gutterbottom">
            <table >
                <thead>
                    <tr>
                        <th>Sr#</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Value</th>
                        <th style={{minWidth:"81px"}}>Actions</th>
                    </tr>
                </thead>
                
            
                <tbody>
                    
                {
                    receipt.map(
                        (r,index)=>{
                            const {id,product,price,quantity} = r;
                            return(
                            <RetailSales_Table 
                                key={index}
                                id={id}
                                index={index}
                                sr={index+1}
                                product={product}
                                price={price}
                                quantity={quantity}
                                value={r.value()}
                                productQuantityDialogHandler={(index)=>this.setState({productQuantityDialogOpen:true,edit_index:index})}
                                productRemoveHandler={this.productRemoveHandler}
                            />)
                        }
                    )
                }
         
                    
                    
                </tbody>
               
            </table>
            </div>
            
            <div className="gutterbottom" style={{display:"flex",justifyContent:"center",position:"relative"}}>
                <div className={styles.aligncenter}>
                    <h1 style={{color:"green"}}>SubTotal</h1>
                    <h2>{this.state.subTotal()}</h2>
                </div>

                <div style={{marginRight:"100px",marginLeft:"100px"}} className={styles.aligncenter}>
                    <h1 style={{color:"red"}}>Discount</h1>
                    <input 
                        type="number"
                        name="discount"
                        value={discount}
                        onChange={this.inputChangeHandler}
                        style={{width:"130px",fontSize:"25px",textAlign:"center"}} 
                    />
                </div>

                <div className={styles.aligncenter}>
                    <h1 >Total</h1>
                    <h2>{this.state.subTotal()-discount}</h2>
                </div>
                <ApolloConsumer>
                    {
                        (client)=>{
                            return(
                                <Button
                                    variant="contained"
                                    className={styles.buttonsetting}
                                    size="large"
                                    onClick={this.printReceiptHandler(client)}
                                    disabled={receipt.length>0?false:true}
                                >
                                    Print receipt
                                </Button>
                            )
                        }
                    }
                </ApolloConsumer>
            </div>


{/* Dialog Starts Here */}

                <Dialog open={productQuantityDialogOpen} onClose={()=>this.setState({productQuantityDialogOpen:false})}>
                    <div className="dialogTitleStyle">
                            <h2>Edit Product Quantity</h2>
                            <IconButton onClick={()=>this.setState({productQuantityDialogOpen:false})}>
                                    <CancelIcon className={styles.delete} />
                            </IconButton>
                    </div>
                    <form  method="post"  onSubmit={this.productQuantityHandler} >
                    <DialogContent>
                        <TextField
                            name="edit_quantity"
                            variant="outlined"
                            label="Quantity"
                            value={edit_quantity}
                            onChange={this.inputChangeHandler}
                            required
                            autoFocus
                            fullWidth 
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            type="submit"
                        >
                            Submit
                        </Button>
                    </DialogActions>
                    </form>

                </Dialog>





            



            <SnackBar snackbarValue={snackbarOpen} snackbarClose={()=>this.setState({snackbarOpen:false})} failed>
                {snackbarMessage}
            </SnackBar>
            </>
        )
    }
}


export default RetailSales;