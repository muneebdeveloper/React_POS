import React,{Component} from 'react';
import gql from 'graphql-tag';
import {ApolloConsumer} from 'react-apollo';
import debounce from 'lodash.debounce';

// import MuiDownshift from 'mui-downshift';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

import styles from '../stock/audit/StockAudit.css';
import styles2 from './RetailSales.css';

const PRODUCTS_SEARCH_QUERY = gql`
    query PRODUCTS_SEARCH_QUERY($name:String,$barcode:String,$sellPrice:Float,$wholesalePrice:Float){
        productsFilterSearch(data:{name:$name,barcode:$barcode,sellPrice:$sellPrice,wholesalePrice:$wholesalePrice}){
            name
            barcode
            sellPrice
            wholesalePrice
        }
    }
`;

class Search extends Component{

    state={
        searchResult:[],
        loading:false,
        name:'',
        barcode:'',
        sellPrice:'',
        wholesalePrice:''
    }

    // stateChangeHandler = client =>async (e)=>{
    //     if(typeof e.inputValue==='string'){
    //         this.setState({loading:true})
    //         let res = await client.query({
    //                     query:PRODUCTS_SEARCH_QUERY,
    //                     variables:{
    //                         searchTerm:e.inputValue
    //                     }
    //                 });
            
    //             this.setState({
    //                 searchResult:res.data.products.map((el)=>({label:el.name,value:el.barcode})),
    //                 loading:false
    //             }); 
    //     }

    // };

    // submitHandler = (item)=>{
    //     this.props.searchHandler(item.value);
    // }
    

    fetchResultHandler = debounce( async (client)=>{

        this.setState({
            loading:true
        });

        const {name,barcode,sellPrice,wholesalePrice} = this.state;

        let res = await client.query({
            query:PRODUCTS_SEARCH_QUERY,
            variables:{
                name,
                barcode,
                sellPrice:Number(sellPrice),
                wholesalePrice:Number(wholesalePrice)
            }
        });

        this.setState({
            searchResult:[...res.data.productsFilterSearch],
            loading:false
        });
    },300);

    inputChangeHandler=async(client,e)=>{
        await this.setState({
            [e.target.name]:e.target.value
        });
        this.fetchResultHandler(client);
    }

    render(){
      let {
            searchResult,
            loading,
            name,
            barcode,
            sellPrice,
            wholesalePrice
        } = this.state;
        return(
                <ApolloConsumer>
                    {
                        (client)=>{
                            return(
                                // <MuiDownshift
                                //     onChange={this.submitHandler}
                                //     items={searchResult}
                                //     variant="outlined"
                                //     getInputProps={()=>({label:"Search Product",autoFocus:true,onFocus:null})}
                                //     onStateChange={this.stateChangeHandler(client)}
                                //     loading={loading}
                                // />
                                <>
                                <table>
                <thead>
                    <tr className={styles.rowStyle}>
                        <th>
                            <TextField 
                                label="Search By Name"
                                name="name"
                                value={name}
                                onChange={(e)=>this.inputChangeHandler(client,e)}
                                fullWidth
                            />
                        </th>
                        <th>
                            <TextField 
                                label="Search By Barcode"
                                name="barcode"
                                value={barcode}
                                onChange={(e)=>this.inputChangeHandler(client,e)}
                                fullWidth
                            />
                        </th>
                        <th>
                            <TextField 
                                label="Search By Sell Price"
                                name="sellPrice"
                                value={sellPrice}
                                onChange={(e)=>this.inputChangeHandler(client,e)}
                                fullWidth
                            />
                        </th>
                        <th>
                            <TextField 
                                label="Search By WholeSale Price"
                                name="wholesalePrice"
                                value={wholesalePrice}
                                onChange={(e)=>this.inputChangeHandler(client,e)}
                                fullWidth
                            />
                        </th>
                    </tr>
                    <tr>
                        <th>Name</th>
                        <th>Barcode</th>
                        <th>Sell Price</th>
                        <th>Wholesale Price</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        searchResult.map((el,index)=>{
                            const {name,barcode,sellPrice,wholesalePrice} = el;
                            return(
                                <tr key={index}>
                                    <td>{name}</td>
                                    <td>{barcode}</td>
                                    <td>{sellPrice}</td>
                                    <td>{wholesalePrice}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            {
                loading && (
                    <div className={styles2.searchStyles}>
                        <CircularProgress size={70} />
                    </div>    
                )
            }

            </>
                            );
                        }
                    }
                </ApolloConsumer>
        );
    }

}

export default Search;