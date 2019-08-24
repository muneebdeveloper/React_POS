import React,{Component} from 'react';
import {ApolloConsumer,Query,Mutation} from 'react-apollo';
import gql from 'graphql-tag';

import ErrorDialog from '../../../misc/ErrorDialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


import ProductSummaryTable from './ProductSummaryTable';
import { CircularProgress } from '@material-ui/core';



const PRODUCT_DETAILS_FETCH_QUERY = gql`
    query PRODUCT_DETAILS_FETCH_QUERY($barcode:String!){
        product(where:{barcode:$barcode}){
            name
            category{
                name
                lineitem{
                    name
                }
            }
            stock{
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


class ProductSummaryMain extends Component{

    state={
        barcode:'',
        productname:'',
        lineitem:'Select',
        category:'Select',
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
        e.preventDefault();
        const res=await client.query({
            query:PRODUCT_DETAILS_FETCH_QUERY,
            variables:{
                barcode:this.state.barcode
            }
        });

        const {data:{product}}=res;

        this.setState({
            productname:product.name,
            lineitem:product.category.lineitem.name,
            category:product.category.name,
            stockList:[...product.stock],
            barcodeSubmitLoadingBar:false
        });
    }

    

    render(){
        const {
                barcodeSubmitLoadingBar,
                productname,
                lineitem,
                category,
                stockList
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

                    <label> Name
                    <input type="text" name="productname" value={productname}  onChange={this.changeHandler} />
                    </label>
                    
                    <label>Line Item
                    <select name="lineitem" onChange={this.changeHandler} >
                        <option>{lineitem}</option>
                    </select>
                    </label>

                    <label>Category
                    <select name="category" onChange={this.changeHandler} >
                        <option>{category}</option>
                    </select>
                    </label>
                    

                </div>

                <h1 style={{textAlign:"center",color:"#736464",marginTop:"30px"}}>Stock Details</h1>

                <table>
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
                                        sr = {index+1}
                                        createdAt = {createdAt.split("T").shift().split("-").reverse().join("-")}
                                        badgeNumber = {badgeNumber}
                                        noofpieces = {noofpieces}
                                        buyPrice = {buyPrice}
                                        sellPrice = {sellPrice}
                                        wholeSalePrice = {wholesalePrice}
                                        expiry = {expiry.split("T").shift().split("-").reverse().join("-")}
                                    />
                                )
                            })
                        }
                    </tbody>
                </table>

            </>
                        )
                    }
                }
            </ApolloConsumer>
        )
    }
}

export default ProductSummaryMain;
