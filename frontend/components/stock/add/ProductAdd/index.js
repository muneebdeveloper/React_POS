import React, {Component} from 'react';
import {ApolloConsumer,Query,Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import ErrorDialog from '../../../misc/ErrorDialog';
import SnackBar from '../../../misc/SnackBar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Cancel from '@material-ui/icons/Cancel';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import ProductAdd from './ProductAdd';
import ProductAddDetail from './ProductAddDetail';
import EditDialog from './EditDialog';
import ProductDefine from '../../define/Product';
import SubmitStock from './SubmitStock';

import styles from './ProductAdd.css';
import styles2 from './index.css';

import {ALL_SUPPLIERS_LIST_QUERY} from '../../../suppliers/editandremove/Suppliers_ed';


const SUPPLIER_AMOUNT_TO_PAY_QUERY  =gql`
    query SUPPLIER_AMOUNT_TO_PAY_QUERY($id:ID!){
        supplier(where:{id:$id}){
            amounttopay
        }
    }
`;


const PRODUCT_FIND_QUERY = gql`
    query PRODUCT_FIND_QUERY($barcode:String!){
        product(where:{barcode:$barcode}){
            id
            name
        }
    }
`;

const CREATE_STOCKITEM_MUTATION = gql`
    mutation CREATE_STOCKITEM_MUTATION($createdAt:DateTime!,$badgeNumber:String!,$noofpieces:Int!,$buyPrice:Float!,$sellPrice:Float!,$wholesalePrice:Float!,$expiry:DateTime,$id:ID!){
        createStockItem(
            data:{
                createdAt:$createdAt,
                badgeNumber:$badgeNumber,
                noofpieces:$noofpieces,
                buyPrice:$buyPrice,
                sellPrice:$sellPrice,
                wholesalePrice:$wholesalePrice,
                expiry:$expiry,
                product:{
                    connect:{
                        id:$id
                    }
                }
            }
        ){
            id
        }
    }
`;

const STOCKITEM_DETAILS_QUERY = gql`
    query STOCKITEM_DETAILS_QUERY($id:ID!){
        stockItem(where:{id:$id}){
            badgeNumber
            noofpieces
            buyPrice
            sellPrice
            wholesalePrice
            expiry
        }
    }
`;

const STOCKITEM_UPDATE_MUTATION = gql`
    mutation STOCKITEM_UPDATE_MUTATION($id:ID!,$badgeNumber:String!,$noofpieces:Int!,$buyPrice:Float!,$sellPrice:Float!,$wholesalePrice:Float!,$expiry:DateTime){
                updateStockItem(
                data:{
                badgeNumber:$badgeNumber,
                noofpieces:$noofpieces,
                buyPrice:$buyPrice,
                sellPrice:$sellPrice,
                wholesalePrice:$wholesalePrice,
                expiry:$expiry},
                where:{
                    id:$id
                    }
                ){
                    id
                }
    }
`;

const STOCKITEM_REMOVE_MUTATION = gql`
    mutation STOCKITEM_REMOVE_MUTATION($id:ID!){
        deleteStockItem(where:{id:$id}){
            id
        }
    }
`;

const SUPPLIER_UPDATE_MUTATION = gql`
    mutation SUPPLIER_UPDATE_MUTATION($amounttopay:Float,$id:ID!){
        updateSupplier(data:{
            amounttopay:$amounttopay
        },where:{
            id:$id
        }){
            name
        }
    }
`;

const PAIDDETAIL_CREATE_MUTATION = gql`
    mutation PAIDDETAIL_CREATE_MUTATION($description:String,$amountpaid:Float,$id:ID!){
        createPaidDetail(data:{
            description:$description,
            amountpaid:$amountpaid,
            supplier:{
                connect:{
                    id:$id
                }
            }
        }){
            createdAt
        }
    }
`;


class ProductAddMain extends Component{

    constructor(props){
        super(props);
        this.inputFieldFocusRef = React.createRef();
    }

    componentDidUpdate(){
        // console.log(document.elementFromPoint(1,1).className);
        // if(document.elementFromPoint(0,0).className=='container'){
        //     console.log("done")
        // }
        if(!this.state.barcode && this.state.submitDisabled && document.elementFromPoint(0,0).className=='container'){
            this.inputFieldFocusRef.current.focus();
        }

    }
   

    state={
        productID:'',
        productname:'',
        barcode:'',
        badge:'',
        buyprice:'',
        sellprice:'',
        wholesaleprice:'',
        noofpieces:'',
        supplier_id:'',
        supplier_name:'',
        expiry:'',
        productDetail:[],
        loadingBar:false,
        supplierDialog:true,
        productCreateDialogOpen:false,
        errorDialogOpen:false,
        errorMessage:'',
        snackbarMessage:'',
        snackbarOpen:false,
        dialogEditOpen:false,
        dialogRemoveOpen:false,
        stockitem_edit_id:'',
        stockitem_edit_index:'',
        editDialogLoading:false,
        editbadge:'',
        editbuyprice:'',
        editsellprice:'',
        editwholesaleprice:'',
        editnoofpieces:'',
        editexpiry:'',
        totalBuyPrice:0,
        totalSellPrice:0,
        totalWholeSalePrice:0,
        totalNoOfPieces:0,
        supplier_description:'',
        supplier_amountpaid:'',
        supplier_previous_amount:0,
        submitStockDialogOpen:false,
        submitDisabled:true,
        submitStockLoading:false,
        addMoreInventoryDialog:false
    }

   
    selectChangeHandler = (e,child)=>{
        this.setState({
            supplier_id:e.target.value,
            supplier_name:child.props.children,
        })
    }

    changeHandler = (e)=>{

        this.setState({
            [e.target.name]:e.target.value
        });
       
    }

    barcodeSubmitHandler=client=>async e =>{
        this.setState({
            loadingBar:true,
        });
        e.preventDefault();
        try{
        const res=await client.query({
            query:PRODUCT_FIND_QUERY,
            variables:{
                barcode:this.state.barcode
            },
            fetchPolicy:'network-only'
        });
        const {data:{product}}=res;
        if(product){
        this.setState({
            productID:product.id,
            productname:product.name,
            loadingBar:false,
            submitDisabled:false
        });
        }else{
            this.setState({
                productCreateDialogOpen:true,
                loadingBar:false
            });
        }
        }
        catch(err){
            this.setState({
                loadingBar:false,
                errorDialogOpen:true,
                errorMessage:'Something went wrong',
                barcode:''
            })
        }
    }

    stockCreateHandler=createStockItem=> async e=>{
        e.preventDefault();
        const {productname,badge,buyprice,sellprice,wholesaleprice,noofpieces,expiry,productDetail} = this.state;
        this.setState({
            productname:'',
        })
        const res =  await createStockItem();
        const stockItem = {
            id:res.data.createStockItem.id,
            productname,
            badge,
            buyprice,
            sellprice,
            wholesaleprice,
            noofpieces,
            expiry
        }
        const stockArray = [...productDetail,stockItem];
        let calcTotalBuyPrice=0,calcTotalSellPrice=0,calcTotalWholeSalePrice=0,calcTotalNoOfPieces=0;
        stockArray.map(
            (item)=>{
                calcTotalBuyPrice = Number(item.buyprice) + calcTotalBuyPrice;
                calcTotalSellPrice = Number(item.sellprice) + calcTotalSellPrice;
                calcTotalWholeSalePrice = Number(item.wholesaleprice) + calcTotalWholeSalePrice;
                calcTotalNoOfPieces = Number(item.noofpieces) + calcTotalNoOfPieces;
            }
        );
        this.setState({
            productDetail:[...stockArray],
            productID:'',
            productname:'',
            barcode:'',
            badge:'',
            buyprice:'',
            sellprice:'',
            wholesaleprice:'',
            noofpieces:'',
            expiry:'',
            submitDisabled:true,
            totalBuyPrice:calcTotalBuyPrice,
            totalSellPrice:calcTotalSellPrice,
            totalWholeSalePrice:calcTotalWholeSalePrice,
            totalNoOfPieces:calcTotalNoOfPieces,
        });
    }

    editDialogQueryHandler = (client)=>async (id,index)=>{
        
        this.setState({
            dialogEditOpen:true,
            editDialogLoading:true,
            stockitem_edit_id:id,
            stockitem_edit_index:index
        });
        const res = await client.query(
            {
                query:STOCKITEM_DETAILS_QUERY,
                variables:{
                    id
                },
                fetchPolicy:'network-only'
            }
        );
        
        const {data:{stockItem:{badgeNumber,buyPrice,sellPrice,wholesalePrice,noofpieces,expiry}}} = res;
        this.setState({
            editDialogLoading:false,
            editbadge:badgeNumber,
            editbuyprice:buyPrice,
            editsellprice:sellPrice,
            editwholesaleprice:wholesalePrice,
            editnoofpieces:noofpieces,
            editexpiry:expiry
        })

    }

    editUpdateHandler = (updateStockItem)=>async (e)=>{
        e.preventDefault();
        await updateStockItem();
    }

    submitStockDialogQueryHandler = async (client)=>{
        this.setState({
            submitStockLoading:true,
            submitStockDialogOpen:true
        });
        
        try{
            const res = await client.query({
                query:SUPPLIER_AMOUNT_TO_PAY_QUERY,
                variables:{
                    id:this.state.supplier_id
                },
                fetchPolicy:'network-only'
            })
            this.setState({
                submitStockLoading:false,
                supplier_previous_amount:res.data.supplier.amounttopay
            })
        }
        catch(error){
            this.setState({
                errorDialogOpen:true,
                errorMessage:"Something went wrong"
            })
        }

    }

    submitStockHandler = (updateSupplier,createPaidDetail)=>async (e)=>{
        e.preventDefault();
        let {
            totalBuyPrice,
            supplier_amountpaid,
            supplier_id,
            supplier_previous_amount,
        } = this.state;
        let amountVar = totalBuyPrice - Number(supplier_amountpaid);
            if(!supplier_previous_amount){
                supplier_previous_amount = 0;
            }
            amountVar = amountVar + Number(supplier_previous_amount);
        try{
        if(Number(supplier_amountpaid)>0){
            await createPaidDetail();
            await updateSupplier({
                variables:{
                    amounttopay:amountVar,
                    id:supplier_id
                }
            });
        }
        else{
            await updateSupplier({
                variables:{
                    amounttopay:amountVar,
                    id:supplier_id
                }
            });
        }
        this.setState({
            snackbarOpen:true,
            snackbarMessage:"Amount has been successfully paid",
            submitDisabled:true,
            submitStockDialogOpen:false,
            productDetail:[],
            supplier_id:'',
            supplier_name:'',
            addMoreInventoryDialog:true,
            submitDisabled:true
        })
        }
        catch(err){
            this.setState({
                submitStockDialogOpen:false,
                errorDialogOpen:true,
                errorMessage:"Something went wrong"
            })
           
        }
    }

    stateInitial = ()=>{
        this.setState(
            {
                productID:'',
                productname:'',
                barcode:'',
                badge:'',
                buyprice:'',
                sellprice:'',
                wholesaleprice:'',
                noofpieces:'',
                supplier_id:'',
                supplier_name:'',
                expiry:'',
                productDetail:[],
                loadingBar:false,
                supplierDialog:true,
                productCreateDialogOpen:false,
                errorDialogOpen:false,
                errorMessage:'',
                snackbarMessage:'',
                snackbarOpen:false,
                dialogEditOpen:false,
                dialogRemoveOpen:false,
                stockitem_edit_id:'',
                stockitem_edit_index:'',
                editDialogLoading:false,
                editbadge:'',
                editbuyprice:'',
                editsellprice:'',
                editwholesaleprice:'',
                editnoofpieces:'',
                editexpiry:'',
                totalBuyPrice:0,
                totalSellPrice:0,
                totalWholeSalePrice:0,
                totalNoOfPieces:0,
                supplier_description:'',
                supplier_amountpaid:'',
                supplier_previous_amount:0,
                submitStockDialogOpen:false,
                submitDisabled:true,
                submitStockLoading:false,
                addMoreInventoryDialog:false
            }
        );
    }

    render(){
        const { barcode,
                productname,
                productID,
                badge,
                buyprice,
                sellprice,
                wholesaleprice,
                noofpieces,
                supplier_id,
                supplier_name,
                expiry,
                loadingBar,
                productDetail,
                supplierDialog,
                productCreateDialogOpen,
                errorDialogOpen,
                errorMessage,
                snackbarOpen,
                snackbarMessage,
                dialogEditOpen,
                dialogRemoveOpen,
                stockitem_edit_id,
                stockitem_edit_index,
                editDialogLoading,
                editbadge,
                editbuyprice,
                editsellprice,
                editwholesaleprice,
                editnoofpieces,
                editexpiry,
                totalBuyPrice,
                totalSellPrice,
                totalWholeSalePrice,
                totalNoOfPieces,
                supplier_description,
                supplier_amountpaid,
                submitStockDialogOpen,
                submitDisabled,
                submitStockLoading,
                addMoreInventoryDialog
              } = this.state;
              let dateFor = new Date();
        return(
            <>
            <h2 style={{color:"#736464",marginBottom:"30px"}}> Supplier Name: {supplier_name}</h2>
           
            <Query query={ALL_SUPPLIERS_LIST_QUERY}>
                {
                    ({data,loading})=>{

                        return(
                            <Dialog open={supplierDialog} >
                                <DialogTitle>Select Supplier</DialogTitle>
                                <form 
                                    onSubmit={
                                        (e)=>{e.preventDefault();
                                            this.setState({
                                                supplierDialog:false
                                            });    
                                        }
                                    }
                                >
                                    
                                        {
                                            loading ? (
                                                <div className="dialogLoadingStyle">
                                                    <CircularProgress size={70} />
                                                </div>
                                            ):
                                            (
                                            <DialogContent>
                                                <FormControl 
                                                    required 
                                                    className={styles.selectMinWidth}
                                                >
                                            <InputLabel>Select Supplier</InputLabel>
                                            <Select
                                                name="supplier_id"
                                                value={supplier_id}
                                                onChange={this.selectChangeHandler}
                                            >
                                                {
                                                data &&  Object.keys(data).length > 0 &&
                                                    data.suppliers.map((supplier)=>{
                                                        return(
                                                            <MenuItem value={supplier.id} key={supplier.id}>{supplier.name}</MenuItem>
                                                        )
                                                    })    
                                                }
                                            </Select>
                                        </FormControl>
                                      
                                         </DialogContent>
                                            )
                                        }
                                        
                                   
                                    <DialogActions>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={supplier_id?false:true}
                                        >
                                            Submit
                                        </Button>
                                    </DialogActions>
                                </form>
                            </Dialog>
                        )

                    }
                }
            </Query>
            
            <ApolloConsumer>
                {
                    (client)=>{

                        if(loadingBar){
                            return(
                                <div className="mainLoadingStyle">
                                    <CircularProgress size={70} />
                                </div>
                                )
                        }

                        if(errorDialogOpen){
                            return(
                                <ErrorDialog 
                                    dialogValue={errorDialogOpen} 
                                    dialogClose={()=>this.setState({errorDialogOpen:false})}
                                >
                                    {errorMessage}
                                </ErrorDialog>
                            )
                        }

                        return(
                            <>
                            
                            <form onSubmit={this.barcodeSubmitHandler(client)}>
                                <div className="mainFormStyle">

                                    <TextField 
                                        label="Enter Barcode"
                                        variant="outlined"
                                        type="text"
                                        name="barcode"
                                        value={barcode}
                                        required
                                        onChange={this.changeHandler}
                                        inputRef={this.inputFieldFocusRef}
                                    />

                                    <Button
                                        variant="contained"
                                        type="submit"
                                        size="large"
                                    >Submit</Button>

                                </div>
                            </form>
                            <h1 style={{textAlign:"center",color:"#736464",marginBottom:"30px"}}>Stock Details</h1>

                         <Mutation 
                            mutation={CREATE_STOCKITEM_MUTATION} 
                            variables={{
                             createdAt:dateFor.toISOString(),
                             badgeNumber:badge,
                             noofpieces:Number(noofpieces),
                             buyPrice:Number(buyprice),
                             sellPrice:Number(sellprice),
                             wholesalePrice:Number(wholesaleprice),
                             expiry:expiry || null,
                             id:productID
                            }}
                            onCompleted={
                                ()=>{
                                    this.setState({
                                        snackbarOpen:true,
                                        snackbarMessage:'Stock has been successfully added'
                                    })
                                }
                            }
                            onError={
                                ()=>{
                                    this.setState({
                                        errorDialogOpen:true,
                                        errorMessage:'something went wrong'
                                    })
                                }
                            }
                         >
                             {
                                 (createStockItem,{loading})=>{

                                     if(loading){
                                        return(
                                            <div className="mainLoadingStyle">
                                                <CircularProgress size={70} />
                                            </div>
                                            )
                                     }
                                     
                                    if(errorDialogOpen){
                                        return(
                                            <ErrorDialog 
                                                dialogValue={errorDialogOpen} 
                                                dialogClose={()=>this.setState({errorDialogOpen:false})}
                                            >
                                                {errorMessage}
                                            </ErrorDialog>
                                        )
                                    }

                                     return(
                                    <>
                                    <ProductAdd 
                                        prochangeHandler={this.changeHandler}
                                        stockChangeHandler={this.stockCreateHandler(createStockItem)}
                                        productname={productname}
                                        badge={badge} 
                                        buyprice={buyprice}
                                        sellprice={sellprice}
                                        wholesaleprice={wholesaleprice}
                                        noofpieces={noofpieces}
                                        expiry={expiry}
                                        submitDisabled={submitDisabled}
                                     />
                                     <SnackBar 
                                        snackbarValue={snackbarOpen} 
                                        snackbarClose={()=>this.setState({snackbarOpen:false})}
                                    >
                                         {snackbarMessage}
                                     </SnackBar>
                                     </>
                                     )
                                 }

                             }
                         </Mutation>
                        <div className="gutterbottomsmall">
                         <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Badge Number</th>
                                    <th>Buy Price</th>
                                    <th>Sell Price</th>
                                    <th>WholeSale Price</th>
                                    <th>No of Pieces</th>
                                    <th>Expiry</th>
                                    <th style={{minWidth:"81px"}}>Actions</th>
                                </tr>
                            </thead>
                            <ApolloConsumer>
                                {
                                    (client)=>{
                                        return(
                                            <tbody>
                                            { productDetail.map((product,index)=>{
                                                const {id,productname,badge,buyprice,sellprice,wholesaleprice,noofpieces,expiry} = product;
                                                return(
                                                    <ProductAddDetail
                                                        key={id}
                                                        index={index}
                                                        id={id}
                                                        productname={productname}
                                                        badge={badge} 
                                                        buyprice={buyprice}
                                                        sellprice={sellprice}
                                                        wholesaleprice={wholesaleprice}
                                                        noofpieces={noofpieces}
                                                        expiry={expiry?expiry.split("T").shift().split("-").reverse().join("-"):null}
                                                        dialogHandlerEdit={this.editDialogQueryHandler(client)}
                                                        dialogHandlerRemove={(id,index)=>this.setState({dialogRemoveOpen:true,stockitem_edit_id:id,stockitem_edit_index:index})}
                                                    />
                                                )
                                            })
                                               
                                            }
                                        </tbody>
                                        )
                                    }
                                }
                            </ApolloConsumer>
                            <tfoot >
                                <tr className={styles2.tableFoot}>
                                    <td ></td>
                                    <td className={styles2.totalRow}>Total</td>
                                    <td>{totalBuyPrice}</td>
                                    <td>{totalSellPrice}</td>
                                    <td>{totalWholeSalePrice}</td>
                                    <td>{totalNoOfPieces}</td>
                                </tr>
                            </tfoot>
                           
                         </table>
                         </div>
                         <ApolloConsumer>
                             {
                                 (client)=>{
                                     return(
                                        <DialogActions>
                                            <Button
                                            variant="contained"
                                            size="large"
                                            disabled={productDetail.length<=0}
                                            onClick={()=>this.submitStockDialogQueryHandler(client)}
                                            >
                                                Submit Stock
                                            </Button>
                                         </DialogActions>
                                     )
                                 }
                             }
                         </ApolloConsumer>
                        

                         <Dialog open={productCreateDialogOpen} onClose={()=>this.setState({productCreateDialogOpen:false})}>
                                <div className="dialogTitleStyle">
                                    <h2>Define Product</h2>
                                    <IconButton onClick={()=>this.setState({productCreateDialogOpen:false})}>
                                            <Cancel className={styles2.delete} />
                                    </IconButton>
                                </div>
                                <DialogContent>
                                    <ProductDefine />
                                </DialogContent>
                         </Dialog>

                         <Dialog open={submitStockDialogOpen} onClose={()=>this.setState({submitStockDialogOpen:false})}>

                                <div className="dialogTitleStyle">
                                    <h2>Submit Stock</h2>
                                    <IconButton onClick={()=>this.setState({submitStockDialogOpen:false})}>
                                            <Cancel className={styles2.delete} />
                                    </IconButton>
                                </div>
                            <Mutation 
                                mutation={SUPPLIER_UPDATE_MUTATION}
                            >
                                {
                                    (updateSupplier,{loading:loading1})=>{
                                        return(
                                            <Mutation 
                                                mutation={PAIDDETAIL_CREATE_MUTATION}
                                                variables={{
                                                    description:supplier_description,
                                                    amountpaid:Number(supplier_amountpaid),
                                                    id:supplier_id
                                                }}
                                            >
                                            {
                                                (createPaidDetail,{loading:loading2})=>{
                                                    if(loading1 || loading2 || submitStockLoading){
                                                        return(
                                                            <div className="dialogLoadingStyle">
                                                                <CircularProgress size={70} />
                                                            </div>
                                                        )
                                                    }

                                                    return(
                                                            <DialogContent>
                                                                <SubmitStock
                                                                    totalBuyPrice={totalBuyPrice}
                                                                    supplier_name={supplier_name}
                                                                    supplier_description={supplier_description}
                                                                    supplier_amountpaid={supplier_amountpaid}
                                                                    submitStockHandler={this.submitStockHandler(updateSupplier,createPaidDetail)}
                                                                    prochangeHandler={this.changeHandler}
                                                                />
                                                            </DialogContent>
                                                    )
                                                }
                                            }
                                            </Mutation>
                                        )
                                    }
                                }
                            </Mutation>

                         </Dialog>

                        <Dialog open={dialogEditOpen} onClose={()=>this.setState({dialogEditOpen:false})}>
                            
                                <div className="dialogTitleStyle">
                                    <h2>Edit Suppliers</h2>
                                    <IconButton onClick={()=>this.setState({dialogEditOpen:false})}>
                                            <Cancel className={styles2.delete} />
                                    </IconButton>
                                </div>
                                {
                                    editDialogLoading ? (
                                        <div className="dialogLoadingStyle">
                                            <CircularProgress size={70} />
                                        </div>
                                    ):(
                                        <Mutation 
                                            mutation={STOCKITEM_UPDATE_MUTATION}
                                            variables={{
                                                id:stockitem_edit_id,
                                                badgeNumber:editbadge,
                                                noofpieces:Number(editnoofpieces),
                                                buyPrice:Number(editbuyprice),
                                                sellPrice:Number(editsellprice),
                                                wholesalePrice:Number(editwholesaleprice),
                                                expiry:editexpiry
                                            }}
                                            onCompleted={
                                                ()=>{
                                                    this.setState(
                                                        (state)=>{
                                                            let stockObject = state.productDetail[stockitem_edit_index];
                                                            let newstockObject={
                                                                ...stockObject,
                                                                badge:editbadge,
                                                                buyprice:editbuyprice,
                                                                sellprice:editsellprice,
                                                                wholesaleprice:editwholesaleprice,
                                                                noofpieces:editnoofpieces,
                                                                expiry:editexpiry
                                                            }
                                                            
                                                            state.productDetail[stockitem_edit_index] = newstockObject;
                                                            let calcTotalBuyPrice=0,calcTotalSellPrice=0,calcTotalWholeSalePrice=0,calcTotalNoOfPieces=0;
                                                            state.productDetail.map(
                                                                (item)=>{
                                                                    calcTotalBuyPrice = Number(item.buyprice) + calcTotalBuyPrice;
                                                                    calcTotalSellPrice = Number(item.sellprice) + calcTotalSellPrice;
                                                                    calcTotalWholeSalePrice = Number(item.wholesaleprice) + calcTotalWholeSalePrice;
                                                                    calcTotalNoOfPieces = Number(item.noofpieces) + calcTotalNoOfPieces;
                                                                }
                                                            );
                                                        return {
                                                        snackbarOpen:true,
                                                        snackbarMessage:'The item has been updated successfully',
                                                        dialogEditOpen:false,
                                                        totalBuyPrice:calcTotalBuyPrice,
                                                        totalSellPrice:calcTotalSellPrice,
                                                        totalWholeSalePrice:calcTotalWholeSalePrice,
                                                        totalNoOfPieces:calcTotalNoOfPieces
                                                        }
                                                    }
                                                    )
                                                }
                                            }
                                            onError={
                                                ()=>{
                                                    this.setState({
                                                        errorMessage:"Something went wrong",
                                                        dialogEditOpen:false,
                                                        errorDialogOpen:true,
                                                    })
                                                }
                                            }
                                        >
                                            {
                                                (updateStockItem,{loading})=>{

                                                    if(loading){
                                                        return(
                                                            <div className="dialogLoadingStyle">
                                                                <CircularProgress size={70} />
                                                            </div>
                                                        )
                                                    }
                                                  

                                                    return(
                                                        <DialogContent>
                                                        <EditDialog 
                                                            prochangeHandler={this.changeHandler}
                                                            editUpdateHandler={this.editUpdateHandler(updateStockItem)}
                                                            badge={editbadge} 
                                                            buyprice={editbuyprice}
                                                            sellprice={editsellprice}
                                                            wholesaleprice={editwholesaleprice}
                                                            noofpieces={editnoofpieces}
                                                            expiry={editexpiry}
                                                    />
                                                    </DialogContent>
                                                    )
                                                }
                                            }
                                        </Mutation>
                                       
                             
                                    )
                                }
                                
                        </Dialog>

                        
                <Dialog open={dialogRemoveOpen} onClose={()=>this.setState({dialogRemoveOpen:false})} >

                            <div style={{padding:"16px 24px"}}>
                                <h2>Are you sure, you want to remove this stock item?</h2>
                            </div>
                            <Mutation
                                mutation={STOCKITEM_REMOVE_MUTATION}
                                variables={{
                                    id:stockitem_edit_id
                                }}
                                onCompleted={
                                    ()=>{
                                        this.setState(
                                            (state)=>{
                                            state.productDetail.splice(stockitem_edit_index,1);
                                            let calcTotalBuyPrice=0,calcTotalSellPrice=0,calcTotalWholeSalePrice=0,calcTotalNoOfPieces=0;
                                            state.productDetail.map(
                                                (item)=>{
                                                    calcTotalBuyPrice = Number(item.buyprice) + calcTotalBuyPrice;
                                                    calcTotalSellPrice = Number(item.sellprice) + calcTotalSellPrice;
                                                    calcTotalWholeSalePrice = Number(item.wholesaleprice) + calcTotalWholeSalePrice;
                                                    calcTotalNoOfPieces = Number(item.noofpieces) + calcTotalNoOfPieces;
                                                }
                                            );
                                            return {
                                            snackbarOpen:true,
                                            snackbarMessage:"Stockitem has been deleted successfully",
                                            dialogRemoveOpen:false,
                                            totalBuyPrice:calcTotalBuyPrice,
                                            totalSellPrice:calcTotalSellPrice,
                                            totalWholeSalePrice:calcTotalWholeSalePrice,
                                            totalNoOfPieces:calcTotalNoOfPieces
                                                    }
                                                     }
                                                )
                                }
                            }
                                onError={
                                    ()=>{
                                        this.setState({
                                            dialogRemoveOpen:false,
                                            errorDialogOpen:true,
                                            errorMessage:"Something went wrong"
                                        })
                                    }
                                }
                            >
                                {
                                    (deleteStockItem,{loading})=>{

                                        if(loading){
                                            return(
                                                <div className="dialogLoadingStyle">
                                                    <CircularProgress size={70} />
                                                </div>
                                            )
                                        }

                                        return(
                                            <DialogActions>
                                                <Button 
                                                    variant="contained"
                                                    size="large"
                                                    onClick={()=>this.setState({dialogRemoveOpen:false})}
                                                    className={styles2.deleteButton}
                                                >
                                                    Cancel
                                                </Button>

                                                <Button 
                                                    variant="contained"
                                                    size="large"
                                                    onClick={()=>deleteStockItem()}
                                                >
                                                    yes
                                                </Button>

                                             </DialogActions>
                                        )
                                    }
                                }
                            </Mutation>                                    
                              
                </Dialog>
                        
                         
                            </>
                        );
                    }
                }
            </ApolloConsumer>

            <Dialog open={addMoreInventoryDialog} onClose={()=>this.setState({addMoreInventoryDialog:false})}>

                <div style={{padding:"16px 24px"}}>
                    <h2>Do you want to add more inventory?</h2>
                </div>

                <DialogActions>
                    <Button 
                                                    variant="contained"
                                                    size="large"
                                                    onClick={()=>Router.push('/')}
                                                    className={styles2.deleteButton}
                                                >
                                                    No
                                                </Button>

                                                <Button 
                                                    variant="contained"
                                                    size="large"
                                                    onClick={()=>this.stateInitial()}
                                                >
                                                    yes
                                                </Button>

                                             </DialogActions>
            </Dialog>
            </>
            );
    }
}

export default ProductAddMain;
export {STOCKITEM_UPDATE_MUTATION,STOCKITEM_REMOVE_MUTATION};