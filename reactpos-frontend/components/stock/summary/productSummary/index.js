import React,{Component} from 'react';
import {ApolloConsumer} from 'react-apollo';
import gql from 'graphql-tag';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';

import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import SnackBar from '../../../misc/SnackBar';
import ErrorDialog from '../../../misc/ErrorDialog';
import ProductSummaryTable from './ProductSummaryTable';
import ProductNameDialog from './ProductNameDialog';
import EditDialog from './EditDialog';
import RemoveDialog from './RemoveDialog';


import styles from '../../../main.css';

const PRODUCT_DETAILS_FETCH_QUERY = gql`
    query PRODUCT_DETAILS_FETCH_QUERY($barcode:String!){
        product(where:{barcode:$barcode}){
            id
            name
            stock(orderBy:createdAt_ASC){
                id
                createdAt
                badgeNumber
                noofpieces
                buyPrice
                sellPrice
                wholesalePrice
                expiry
            }
        }
    }
`;

const PRODUCT_REMOVE_MUTATION = gql`
    mutation PRODUCT_REMOVE_MUTATION($barcode:String!){
        deleteProduct(where:{barcode:$barcode}){
            id
        }
    }
`;



class ProductSummaryMain extends Component{

    state={
        barcode:'',
        productname:'',
        productNameDialog:false,
        editDialog:false,
        removeDialog:false,
        removeID:'',
        snackbar:false,
        snackbarMessage:"",
        editDialogData:{},
        errorDialog:false,
        errorMessage:'',
        productRemoveDialog:false,
        productRemoveLoading:false,
        stockList:[],
        barcodeSubmitLoadingBar:false
    }

    

    changeHandler = e=>{
        this.setState({
            [e.target.name]:e.target.value
        });
       
    }

    barcodeSubmitHandler=client=>async e =>{
        
        this.setState({
            barcodeSubmitLoadingBar:true
        });

        if(e){
            e.preventDefault();
        }
        
        try{
            const res=await client.query({
                query:PRODUCT_DETAILS_FETCH_QUERY,
                variables:{
                    barcode:this.state.barcode
                },
                fetchPolicy:'network-only'
            });
            
            const {data:{product}}=res;
            
            if(product){
                this.setState({
                    productname:product.name,
                    productID:product.id,
                    stockList:[...product.stock],
                    barcodeSubmitLoadingBar:false
                });
            }else{
                this.setState({
                    barcodeSubmitLoadingBar:false,
                    errorDialog:true,
                    errorMessage:"Product does not exist",
                    barcode:''
                })
            }
            
            
        }catch(err){
            this.setState({
                barcodeSubmitLoadingBar:false,
                errorDialog:true,
                errorMessage:"Something went wrong",
                barcode:''
            })
        }
        
        
    }

    dialogHandlerEdit = (index)=>{

        this.setState((state)=>({
            editDialog:true,
            editDialogData:{...state.stockList[index]}
        }));

    }

    productRemoveHandler = async (client)=>{
        this.setState({
            productRemoveLoading:true
        })
        try{
            await client.mutate({
                mutation:PRODUCT_REMOVE_MUTATION,
                variables:{
                    barcode:this.state.barcode
                }
            });
            this.setState({
                snackbar:true,
                snackbarMessage:"Product is successfully removed"
            });
            this.InititalState();
        }catch(err){
            this.setState({
                errorDialog:true,
                errorMessage:"Product can not be deleted",
                productRemoveDialog:false,
                productRemoveLoading:false
            })
        }
    }

    InititalState = ()=>{

        this.setState({
            barcode:'',
            productname:'',
            productNameDialog:false,
            editDialog:false,
            removeDialog:false,
            removeID:'',
            editDialogData:{},
            errorDialog:false,
            errorMessage:'',
            productRemoveDialog:false,
            productRemoveLoading:false,
            stockList:[],
            barcodeSubmitLoadingBar:false
        });    

    }

    render(){
        const {
                barcodeSubmitLoadingBar,
                productname,
                barcode,
                productNameDialog,
                productID,
                snackbar,
                snackbarMessage,
                errorDialog,
                errorMessage,
                editDialog,
                removeDialog,
                productRemoveDialog,
                productRemoveLoading,
                removeID,
                stockList,
                editDialogData
             } = this.state;

            if(barcodeSubmitLoadingBar){
                return(
                    <div className="mainLoadingStyle">
                        <CircularProgress size={70} />
                    </div>
                )
            }
            
            return(
                <ApolloConsumer>
                    {
                        (client)=>{
                            return(
                                <>
                                    <form onSubmit={this.barcodeSubmitHandler(client)}>
                        
                                        <div className="mainFormStyle">

                                            <TextField 
                                                label="Product Bar Code"
                                                variant="outlined"
                                                type="text" 
                                                name="barcode"
                                                value={barcode}
                                                onChange={this.changeHandler}
                                                
                                            />
                        
                                            <Button 
                                                variant="contained"
                                                size="large"
                                                type="submit"
                                            >Submit</Button>

                                        </div>
                    
                                    </form>

                <h1 style={{textAlign:"center",color:"#736464",marginTop:"30px"}}>Details</h1>

                <div className="detailArea">
                    {productname && (
                            <h2>
                                Name: {productname} 
                                <IconButton 
                                    size="small"
                                    onClick={()=>this.setState({productNameDialog:true})}
                                >
                                    <EditIcon className={styles.edit} />
                                </IconButton>

                                <IconButton 
                                    size="small"
                                    onClick={()=>this.setState({productRemoveDialog:true})}
                                >
                                    <DeleteIcon className={styles.delete} />
                                </IconButton>
                            </h2>        
                        )}           
                </div>

                <h1 style={{textAlign:"center",color:"#736464",marginTop:"30px"}}>Stock Details</h1>

                <table className="gutterbottom">
                    <thead>
                        <tr>
                            <th>Sr#</th>
                            <th>Created at</th>
                            <th>Badge Number</th>
                            <th>Number of Pieces</th>
                            <th>Buy Price</th>
                            <th>Sell Price</th>
                            <th>WholeSale Price</th>
                            <th>Expiry</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            stockList.map((stock,index)=>{
                                let {id,createdAt,badgeNumber,noofpieces,buyPrice,sellPrice,wholesalePrice,expiry} = stock;
                                return(
                                    <ProductSummaryTable
                                        key = {id}
                                        id = {id}
                                        index={index}
                                        sr = {index+1}
                                        createdAt = {createdAt.split("T").shift().split("-").reverse().join("-")}
                                        badgeNumber = {badgeNumber}
                                        noofpieces = {noofpieces}
                                        buyPrice = {buyPrice}
                                        sellPrice = {sellPrice}
                                        wholeSalePrice = {wholesalePrice}
                                        {...(expiry && {expiry : expiry.split("T").shift().split("-").reverse().join("-")})}
                                        dialogHandlerEdit={this.dialogHandlerEdit}
                                        dialogHandlerRemove={(id)=>this.setState({removeDialog:true,removeID:id})}
                                    />
                                )
                            })
                        }
                    </tbody>
                </table>

{/* Dialog Starts Here */}

            {/* Product Name Dialog */}

                <Dialog open={productNameDialog} onClose={()=>this.setState({productNameDialog:false})}>
                    <div className="dialogTitleStyle">
                                <h2>Edit Stock</h2>
                                <IconButton onClick={()=>this.setState({productNameDialog:false})}>
                                        <CancelIcon className={styles.delete} />
                                </IconButton>
                    </div>
                    <DialogContent>
                        <ProductNameDialog 
                            name={productname}
                            id={productID}
                            dialogClose={()=>{
                                this.setState({productNameDialog:false});
                                this.barcodeSubmitHandler(client)();
                            }}
                        />
                    </DialogContent>
                </Dialog> 

            {/* Remove Product Dialog */}

                <Dialog open={productRemoveDialog} onClose={()=>this.setState({productRemoveDialog:false})}>

                    <div className="dialogTitleStyle">
                            <h2>Are you sure, you want to remove this Product?</h2>
                            <IconButton onClick={()=>this.setState({productRemoveDialog:false})}>
                                    <CancelIcon className={styles.delete} />
                            </IconButton>
                    </div>
                    { productRemoveLoading ?
                        (
                            <div className="dialogLoadingStyle">
                                <CircularProgress size={70} />
                            </div>
                            )
                    :(
                        <DialogActions>
        
                          
                            <Button 
                                variant="contained"
                                size="large"
                                onClick={()=>this.productRemoveHandler(client)}
                            >
                                yes
                            </Button>
                            
                        </DialogActions>
                    
                    )}
                </Dialog>

            {/* Edit Dialog */}

                <Dialog open={editDialog} onClose={()=>this.setState({editDialog:false})}>
                    <div className="dialogTitleStyle">
                            <h2>Edit Stock</h2>
                            <IconButton onClick={()=>this.setState({editDialog:false})}>
                                    <CancelIcon className={styles.delete} />
                            </IconButton>
                    </div>
                    <DialogContent>
                        <EditDialog
                            id={editDialogData.id}
                            badge={editDialogData.badgeNumber}
                            buyprice={editDialogData.buyPrice}
                            sellprice={editDialogData.sellPrice}
                            wholesaleprice={editDialogData.wholesalePrice}
                            noofpieces={editDialogData.noofpieces}
                            expiry={editDialogData.expiry}
                            dialogClose={()=>{
                                    this.setState({editDialog:false});
                                    this.barcodeSubmitHandler(client)();
                                }}
                        />
                    </DialogContent>
                </Dialog>

            {/* Remove Dilaog */}
                <Dialog open={removeDialog} onClose={()=>this.setState({removeDialog:false})}>

                    <div className="dialogTitleStyle">
                            <h2>Are you sure, you want to remove this stock item?</h2>
                            <IconButton onClick={()=>this.setState({removeDialog:false})}>
                                    <CancelIcon className={styles.delete} />
                            </IconButton>
                    </div>
                    <RemoveDialog 
                        id={removeID}
                        dialogClose={(action)=>{
                            this.setState({removeDialog:false});
                            this.barcodeSubmitHandler(client)();
                           
                        }
                        }
                    />
                    

                </Dialog>

            {/* Error Dialog */}
                <ErrorDialog 
                    dialogValue={errorDialog}
                    dialogClose={()=>this.setState({errorDialog:false})}
                >
                    {errorMessage}
                </ErrorDialog>

            {/* SnackBar Notifier */}
                <SnackBar snackbarValue={snackbar} snackbarClose={()=>this.setState({snackbar:false})}>
                    {snackbarMessage}
                </SnackBar>
            </>
                        )
                    }
                }
            </ApolloConsumer>
        )
    }
}

export default ProductSummaryMain;
export {PRODUCT_DETAILS_FETCH_QUERY};
