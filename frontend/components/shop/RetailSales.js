import React, {Component} from 'react';
import {ApolloConsumer} from 'react-apollo';
import gql from 'graphql-tag';
import ReactToPrint from 'react-to-print';

import Search from './Search';
import Ticket from './Ticket';
import CurrentUser from '../CurrentUser';

import Intro from '../misc/Intro';
import SnackBar from '../misc/SnackBar';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import SearchIcon from '@material-ui/icons/Search';
import Delete from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import PanTool from '@material-ui/icons/PanTool';
import ShoppingCart from '@material-ui/icons/ShoppingCart'

import styles from './RetailSales.css';
import RetailSales_Table from './RetailSales_Table';


// const BARCODE_CREATE_MUTATION = gql`
//     mutation BARCODE_CREATE_MUTATION($code:String!,$name:String!){
//         createBarcode(data:{code:$code,name:$name}){
//             code
//         }
//     }
// `;

const PRICE_DETAILS_QUERY = gql`
    query priceDetails($barcode:String!,$type:String!){
        priceDetails(where:{barcode:$barcode,type:$type}){
            productID,
            name,
            price
            quantity
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
    mutation CREATE_SALESITEM_MUTATION($type:String!,$noofpieces:Int!,$priceSold:Float!,$discountUnit:Float,$discount:Float,$id:ID!,$receipt:String!){
        createSalesItem(data:{
            type:$type,
            noofpieces:$noofpieces,
            priceSold:$priceSold,
            originalQuantity:$noofpieces,
            discountUnit:$discountUnit,
            discount:$discount,
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


function titleCase(str) {
    let string = str.toLowerCase().split(' ');
    for (var i = 0; i < string.length; i++) {
      string[i] = string[i].charAt(0).toUpperCase() + string[i].slice(1); 
    }
    return string.join(' ');
  }
  


class RetailSales extends Component{

    constructor(props){
        super(props);

        this.inputFieldRef = React.createRef();
        this.printerButtonRef = React.createRef();
    }

    state={
        sale_type:'retailsale',
        barcode:'',
        receipt:[],
        snackbarOpen:false,
        edit_quantity:1,
        edit_actual_quantity:null,
        searchDialogOpen:false,
        snackbarMessage:'',
        subTotal:function(){
            let totalValue=0;
            this.receipt.map((t)=>{
                totalValue += Number(t.value());
            });
            return totalValue;
        },
        productQuantity:function(){
            let totalQuantity = 0;
            this.receipt.map((t)=>{
                totalQuantity+=Number(t.quantity);
            });
            return totalQuantity;
        },
        discount:0,
        productQuantityDialogOpen:false,
        barcodeSubmitLoading:false,
        printReceiptLoading:false,
        ticket:'',
        ticketDate:''
    }

    componentDidMount(){
        this.inputFieldRef.current.focus();
        
    }

    inputChangeHandler = (e)=>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    searchHandler=async (client,barcode)=>{
        await this.setState({
            barcode,
            searchDialogOpen:false
        });
        
        this.barcodeSubmitForSellPrice(client)();
    }

    barcodeSubmitForSellPrice = (client)=>async (e)=>{
        if(e){
            e.preventDefault();
        }
        
        this.setState({
            barcodeSubmitLoading:true
        });

        let res = await client.query({
            query:PRICE_DETAILS_QUERY,
            variables:{
                barcode:this.state.barcode,
                type:this.state.sale_type
            },
            fetchPolicy:'network-only'
        });
        
        if(res.data.priceDetails){
            const {name,productID,quantity,price} = res.data.priceDetails;
        
            if(price && quantity > 0){
                let foundIndex,receiptObject;
                foundIndex = this.state.receipt.findIndex((arr)=>productID===arr.id);
                if(foundIndex==-1){
                    receiptObject = {
                        id:productID,
                        product:name,
                        price,
                        quantity:1,
                        actualQuantity:quantity,
                        value:function(){return this.quantity*this.price}
                    };
                    
                    this.setState((state)=>{
                        state.receipt.push(receiptObject);
                        return{
                            barcode:'',
                            barcodeSubmitLoading:false
                        };
                       
                    })
                    this.inputFieldRef.current.focus();
                }
                else{
                    
                    if(this.state.receipt[foundIndex].actualQuantity-this.state.receipt[foundIndex].quantity<=0){
                        this.setState({
                            snackbarOpen:true,
                            snackbarMessage:"The stock doesnot have enough quantity",
                            barcode:'',
                            barcodeSubmitLoading:false
                        })
                    }else{
                        this.setState((state)=>{
                            state.receipt[foundIndex].quantity++;
                            return({
                                barcode:'',
                                barcodeSubmitLoading:false
                            });
                        });
                    }  
                    this.inputFieldRef.current.focus();
                }
            }else{
                this.setState({
                    snackbarOpen:true,
                    snackbarMessage:"The stock doesnot exist",
                    barcode:'',
                    barcodeSubmitLoading:false
                })
                this.inputFieldRef.current.focus();
            }
        }
        if(!res.data.priceDetails){
                this.setState({
                    snackbarOpen:true,
                    snackbarMessage:"The Product doesnot exist",
                    barcode:'',
                    barcodeSubmitLoading:false
                });
                this.inputFieldRef.current.focus();
        }
    }

    productRemoveHandler = (index)=>{
        this.setState((state)=>{
            state.receipt.splice(index,1);
            if(state.receipt.length<=0){
                return{
                    discount:0
                }
            }
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
        this.setState({
            printReceiptLoading:true
        })
        const res= await client.mutate({
            mutation:CREATE_SALESTICKET_MUTATION
        });
        const salesTicket = res.data.createSalesTicket.receipt;

        let totalDiscountPercentage = (Number(this.state.discount)/Number(this.state.subTotal()))*100;
        
        this.state.receipt.map((r)=>{
            const {id,price,quantity} = r;
            client.mutate({
                mutation:CREATE_SALESITEM_MUTATION,
                variables:{
                    ...(this.state.sale_type==='retailsale'?{type:'retail'}:{type:'wholesale'}),
                    noofpieces:Number(quantity),
                    priceSold:Number(price),
                    originalQuantity:Number(quantity),
                    discountUnit:(Number(price)*totalDiscountPercentage)/100,
                    discount(){
                        this.discount = this.discountUnit * this.originalQuantity;
                        return this;
                    },
                    id:id,
                    receipt:salesTicket
                }.discount()
            });
        });
        let requiredDate = new Date();
        this.setState({
            printReceiptLoading:false,
            ticket:salesTicket,
            ticketDate:requiredDate.toString().split("G").shift()
        });
        this.printerButtonRef.current.triggerRef.click();
        this.stateInitial();
    }

    stateInitial = ()=>{
        this.setState({
            sale_type:'retailsale',
            barcode:'',
            receipt:[],
            snackbarOpen:false,
            edit_quantity:1,
            edit_actual_quantity:null,
            snackbarMessage:'',
            searchDialogOpen:false,
            subTotal:function(){
                let totalValue=0;
                this.receipt.map((t)=>{
                    totalValue += Number(t.value());
                });
                return totalValue;
            },
            productQuantity:function(){
                let totalQuantity = 0;
                this.receipt.map((t)=>{
                    totalQuantity+=Number(t.quantity);
                });
                return totalQuantity;
            },
            discount:0,
            productQuantityDialogOpen:false,
            barcodeSubmitLoading:false,
            printReceiptLoading:false,
            // ticket:'',
            ticketDate:''
        });
    }

    render(){
        const {
            sale_type,
            barcode,
            receipt,
            snackbarOpen,
            edit_quantity,
            edit_actual_quantity,
            discount,
            searchDialogOpen,
            barcodeSubmitLoading,
            snackbarMessage,
            productQuantityDialogOpen,
            printReceiptLoading,
            ticket,
            ticketDate
        } = this.state;

        return(
            <>
            <Intro>
                {sale_type==='retailsale'?"Retail Sales":"WholeSale"}
            </Intro>
            <CurrentUser>
                {
                    ({data})=>{
                        if(data.currentUser && data.currentUser.username=="admin")
                        return(
                            <div className={styles.saleSelectDivStyles}>
                                <h3 style={{color:"#423c3c",marginRight:"24px"}}>Select your Sale Type:</h3>
                                <FormControl
                                    className={styles.saleSelectStyles}
                                    disabled={receipt.length>0?true:false}
                                >
                                    <InputLabel>Select Sale</InputLabel>
                                    <Select
                                        value={sale_type}
                                        name="sale_type"
                                        onChange={this.inputChangeHandler}
                                    >
                                        <MenuItem value="retailsale">Retail Sales</MenuItem>
                                        <MenuItem value="wholesale">WholeSale</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        );
                        return null;
                    }
                }
            </CurrentUser>
            
            <div className={`gutterbottom ${styles.maintoolbar}`}>
            <ApolloConsumer>
                {
                    (client)=>{
                        if(barcodeSubmitLoading){
                            return(
                                <CircularProgress size={45} />
                            )
                        }
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
                                    disabled={!barcode}
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
                    onClick={()=>this.setState({searchDialogOpen:true})}
                    >
                        <SearchIcon 
                            className={styles.marginRight}
                           
                         />
                        Search Product
                    </Button>
                    {/* <Button
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
                    </Button> */}

                    <Button
                    variant="contained"
                    className={styles.red}
                    disabled={receipt.length<=0}
                    onClick={this.stateInitial}
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
                            const {id,product,price,quantity,actualQuantity} = r;
                            
                            return(
                            <RetailSales_Table 
                                key={index}
                                id={id}
                                index={index}
                                sr={index+1}
                                product={titleCase(product)}
                                price={price}
                                quantity={quantity}
                                value={r.value()}
                                actualQuantity={actualQuantity}
                                productQuantityDialogHandler={(index,a_Quantity)=>this.setState({productQuantityDialogOpen:true,edit_index:index,edit_actual_quantity:a_Quantity})}
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

                <CurrentUser>
                    {
                        ({data})=>{
                            if(data.currentUser && data.currentUser.username=="admin"){
                                return(
                                    <div style={{marginRight:"100px",marginLeft:"100px"}} className={styles.aligncenter}>
                                    <h1 style={{color:"red"}}>Discount</h1>
                                    <input 
                                        type="number"
                                        name="discount"
                                        value={discount}
                                        disabled={receipt.length<=0}
                                        onChange={this.inputChangeHandler}
                                        style={{width:"130px",fontSize:"25px",textAlign:"center"}} 
                                    />
                                </div>                                    
                                );
                            }
                            return (
                                <div style={{marginRight:"100px",marginLeft:"100px"}} className={styles.aligncenter}></div>
                            );
                        }
                    }
                </CurrentUser>
               

                <div className={styles.aligncenter}>
                    <h1 >Total</h1>
                    <h2>{this.state.subTotal()-discount}</h2>
                </div>
                <ApolloConsumer>
                    {
                        (client)=>{
                            if(printReceiptLoading){
                                return(
                                    <div style={{position: "absolute",right: "10%",top: "25%"}}>
                                        <CircularProgress size={45} />
                                    </div>
                                )
                            }
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
            
            <ReactToPrint
                trigger={()=>(<a href="#" style={{display:"none"}}>Print Ticket</a> )}
                content={()=>this.componentRef}
                ref={this.printerButtonRef}
            />  
            
            <Ticket 
                ref={(el)=>(this.componentRef = el)} 
                receipt={receipt} 
                date={ticketDate}
                ticket={ticket}
                subTotal={this.state.subTotal()}
                quantity={this.state.productQuantity()}
                discount={discount}
                netTotal={this.state.subTotal()-discount}
             />


{/* Dialog Starts Here */}


        {/* Quantity dialog  */}

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
                            type="number"
                            label="Quantity"
                            value={edit_quantity}
                            onChange={this.inputChangeHandler}
                            required
                            autoFocus
                            fullWidth
                            error={edit_quantity<1 || edit_quantity>edit_actual_quantity}
                            {...((edit_quantity<1 || edit_quantity>edit_actual_quantity) && {helperText:"Quantity is invalid"})}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={edit_quantity<0 || edit_quantity>edit_actual_quantity}
                        >
                            Submit
                        </Button>
                    </DialogActions>
                    </form>

                </Dialog>

        {/* Search dialog */}
                
                <Dialog open={searchDialogOpen} onClose={()=>this.setState({searchDialogOpen:false})}>

                    <div className="dialogTitleStyle">
                        <h2>Search Product</h2>
                        <IconButton onClick={()=>this.setState({searchDialogOpen:false})}>
                                <CancelIcon className={styles.delete} />
                        </IconButton>
                    </div>

                    <DialogContent>
                    <ApolloConsumer>
                        {
                            (client)=>{
                                return(
                                    <Search  searchHandler={(barcode)=>{
                                        this.searchHandler(client,barcode);}} />
                                )
                            }
                        }
                    </ApolloConsumer>

                    </DialogContent>

                </Dialog>

            <SnackBar snackbarValue={snackbarOpen} snackbarClose={()=>this.setState({snackbarOpen:false})} failed>
                {snackbarMessage}
            </SnackBar>
            </>
        )
    }
}


export default RetailSales;