import React,{Component} from 'react';

import {ApolloConsumer,Query,Mutation} from 'react-apollo';
import gql from 'graphql-tag';

import ProductSummaryTable from './ProductSummaryTable';

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
        disabler:true,
        loadingBar:false
    }

    changeHandler = e=>{
        this.setState({
            [e.target.name]:e.target.value
        });
       
    }

    barcodeSubmitHandler=client=>async e =>{
        this.setState({
            loadingBar:true
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
            loadingBar:false
        });
    }

    render(){
        const {loadingBar,productname,lineitem,category,stockList,disabler} = this.state;
        console.log(stockList);
        if(loadingBar){
            return(<h1>Loading</h1>)
        }
        return(
            <ApolloConsumer>
                {
                    (client)=>{
                        return(
                            <>
                <form onSubmit={this.barcodeSubmitHandler(client)}>
                    <label>
                        Product Code
                        <input type="text" autoFocus name="barcode" onChange={this.changeHandler} />
                        <button type="submit">Submit</button>
                    </label>
                </form>

                <h1 style={{textAlign:"center",color:"#736464",marginTop:"30px"}}>Details</h1>

                <div className="detailArea">

                    <label> Name
                    <input type="text" name="productname" value={productname} disabled={disabler} onChange={this.changeHandler} />
                    </label>
                    
                    <label>Line Item
                    <select name="lineitem" disabled={disabler} onChange={this.changeHandler} >
                        <option>{lineitem}</option>
                    </select>
                    </label>

                    <label>Category
                    <select name="category" disabled={disabler} onChange={this.changeHandler} >
                        <option>{category}</option>
                    </select>
                    </label>
                    

                </div>

                <h1 style={{textAlign:"center",color:"#736464",marginTop:"30px"}}>Stock Details</h1>

                <table>
                    <thead>
                        <th>Sr#</th>
                        <th>Created at</th>
                        <th>Badge Number</th>
                        <th>Number of Pieces</th>
                        <th>Buy Price</th>
                        <th>Sell Price</th>
                        <th>WholeSale Price</th>
                        <th>Expiry</th>
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
                                        createdAt = {createdAt.split("T").shift()}
                                        badgeNumber = {badgeNumber}
                                        noofpieces = {noofpieces}
                                        buyPrice = {buyPrice}
                                        sellPrice = {sellPrice}
                                        wholeSalePrice = {wholesalePrice}
                                        expiry = {expiry.split("T").shift()}
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
