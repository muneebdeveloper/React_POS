import React, {Component} from 'react';

import {ApolloConsumer,Mutation} from 'react-apollo';

import ProductAdd from './ProductAdd';
import ProductAddDetail from './ProductAddDetail';

import gql from 'graphql-tag';

const PRODUCT_FIND_QUERY = gql`
    query PRODUCT_FIND_QUERY($barcode:String!){
        product(where:{barcode:$barcode}){
            id
            name
        }
    }
`;

const CREATE_STOCKITEM_MUTATION = gql`
    mutation CREATE_STOCKITEM_MUTATION($badgeNumber:String!,$noofpieces:Int!,$buyPrice:Float!,$sellPrice:Float!,$wholesalePrice:Float!,$expiry:DateTime,$id:ID!){
        createStockItem(
            data:{
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



class ProductAddMain extends Component{

    state={
        productID:'',
        productname:'',
        barcode:'',
        badge:'',
        buyprice:'',
        sellprice:'',
        wholesaleprice:'',
        noofpieces:'',
        expiry:'',
        loadingBar:false,
        productDetail:[]
    }

    changeHandler = (name,e)=>{
        this.setState({
            [name]:e.target.value
        });
       
    }

    barcodeSubmitHandler=client=>async e =>{
        this.setState({
            loadingBar:true
        });
        e.preventDefault();
        const res=await client.query({
            query:PRODUCT_FIND_QUERY,
            variables:{
                barcode:this.state.barcode
            }
        });

        const {data:{product}}=res;

        this.setState({
            productID:product.id,
            productname:product.name,
            loadingBar:false
        });
    }

    stockSubmitHandler=createStockItem=> async e=>{
        e.preventDefault();
        await createStockItem();
        const {productname,badge,buyprice,sellprice,wholesaleprice,noofpieces,expiry,productDetail} = this.state;
        const stockItem = {
            productname,
            badge,
            buyprice,
            sellprice,
            wholesaleprice,
            noofpieces,
            expiry 
        }
        const stockArray = [...productDetail,stockItem];
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
            expiry:''
        });
    }

    render(){
        const {productname,productID,badge,buyprice,sellprice,wholesaleprice,noofpieces,expiry,loadingBar,productDetail} = this.state;
   
        return(
            <ApolloConsumer>
                {
                    (client)=>{
                        if(loadingBar){
                            return(<h1>Loading</h1>)
                        }

                        return(
                            <>
                            <form onSubmit={this.barcodeSubmitHandler(client)}>
                                <label>Enter Barcode:
                                    <input type="text" required autoFocus onChange={this.changeHandler.bind(this,"barcode")} />
                                </label>
                                <button type="submit">Enter</button>
                            </form>
                            <br />

                         <Mutation mutation={CREATE_STOCKITEM_MUTATION} variables={{
                             badgeNumber:badge,
                             noofpieces:Number(noofpieces),
                             buyPrice:Number(buyprice),
                             sellPrice:Number(sellprice),
                             wholesalePrice:Number(wholesaleprice),
                             expiry:expiry,
                            //  expiry:`${expiry}T00:00`,
                             id:productID,
                         }}>
                             {
                                 (createStockItem,{loading})=>{
                                     if(loading){
                                         return <h1>Loading</h1>
                                     }
                                     return(
                                    <ProductAdd 
                                        prochangeHandler={this.changeHandler}
                                        stockChangeHandler={this.stockSubmitHandler(createStockItem)}
                                        productname={productname}
                                        badge={badge} 
                                        buyprice={buyprice}
                                        sellprice={sellprice}
                                        wholesaleprice={wholesaleprice}
                                        noofpieces={noofpieces}
                                        expiry={expiry}
                                     /> )
                                 }

                             }
                         </Mutation>

                         <table>
                            <thead>
                                <th>Name</th>
                                <th>Badge Number</th>
                                <th>Buy Price</th>
                                <th>Sell Price</th>
                                <th>WholeSale Price</th>
                                <th>No of Pieces</th>
                                <th>Expiry</th>
                            </thead>
                            <tbody>
                                { productDetail.map((product)=>{
                                    const {productname,badge,buyprice,sellprice,wholesaleprice,noofpieces,expiry} = product;
                                    return(
                                        <ProductAddDetail
                                            productname={productname}
                                            badge={badge} 
                                            buyprice={buyprice}
                                            sellprice={sellprice}
                                            wholesaleprice={wholesaleprice}
                                            noofpieces={noofpieces}
                                            expiry={expiry}
                                        />
                                    )
                                })
                                   
                                }
                            </tbody>
                         </table>
                                        
                                           
                         
                            </>
                        );
                    }
                }
            </ApolloConsumer>
            );
    }
}

export default ProductAddMain;