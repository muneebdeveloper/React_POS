import React,{Component} from 'react';
import {ApolloConsumer} from 'react-apollo';
import gql from 'graphql-tag';

import {FETCH_LINEITEMS_QUERY} from '../define/Category';
import {ALL_CATEGORIES_QUERY} from '../../sales/salesProfit/Profit_Sales';


import ErrorDialog from '../../misc/ErrorDialog';

import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import StockAuditTable from './StockAuditTable';

import styles from './StockAudit.css';


const PRODUCTS_AUDIT = gql`
    query PRODUCTS_AUDIT($lineitemID:String,$categoryID:String){
        productsAudit(data:{lineitemID:$lineitemID,categoryID:$categoryID}){
            name
            barcode
            quantity
            sellPrice
            wholesalePrice
        }
    }
`;




class StockAudit extends Component{

    state={
        mainmenu:'',
        submenu:'',
        mainmenuLoading:'',
        disablesubmenu:true,
        submenuData:[],
        errorDialog:false,
        errorMessage:'',
        results:[],
        formLoading:false
    }

    inputChangeHandler = (e)=>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    mainmenuChangeHandler=async (client,e)=>{
        
        this.setState({
            mainmenu:e.target.value,
            mainmenuLoading:true
        });

        let res;

        try{
            switch(e.target.value){

                case "all":
                        this.setState({
                            mainmenuLoading:false,
                            disablesubmenu:true,
                        })
                        break;

                case "lineitem":
                        res = await client.query({
                            query:FETCH_LINEITEMS_QUERY,
                            fetchPolicy:'network-only'
                        });
                        this.setState({
                            submenuData:[...res.data.lineItems],
                            mainmenuLoading:false,
                            disablesubmenu:false,
                        })
                        break;

                case "category":
                        res = await client.query({
                            query:ALL_CATEGORIES_QUERY,
                            fetchPolicy:'network-only'
                        });
                        this.setState({
                            submenuData:[...res.data.categories],
                            mainmenuLoading:false,
                            disablesubmenu:false,
                        })
                        break;
            }
        }catch(err){
                this.setState({
                    errorDialog:true,
                    errorMessage:"Something went wrong"
                });   
        }
        
    }

    formSubmitHandler = async (client)=>{

        try{
            let res;
            switch(this.state.mainmenu){
                
                case 'all':
                    res = await client.query({
                        query:PRODUCTS_AUDIT,
                        fetchPolicy:'network-only'
                    });
                    this.setState({
                        results:[...res.data.productsAudit],
                        formLoading:false
                    });
                    break;
                    
                case 'lineitem':
                     res = await client.query({
                        query:PRODUCTS_AUDIT,
                        variables:{
                            lineitemID:this.state.submenu,
                        },
                        fetchPolicy:'network-only'
                    });
                    this.setState({
                        results:[...res.data.productsAudit],
                        formLoading:false
                    });
                    break; 
                    
                case 'category':
                     res = await client.query({
                        query:PRODUCTS_AUDIT,
                        variables:{
                            categoryID:this.state.submenu,
                        },
                        fetchPolicy:'network-only'
                    });
                    this.setState({
                        results:[...res.data.productsAudit],
                        formLoading:false
                    });
                    break; 
            }

        }catch(err){
            this.setState({
                formLoading:false,
                errorDialog:true,
                errorMessage:"Something went wrong"
            });
        }

    }
            


    render(){

        const {
            mainmenu,
            mainmenuLoading,
            submenu,
            disablesubmenu,
            submenuData,
            errorDialog,
            errorMessage,
            results
        } = this.state;

        return(
            <>
            <ApolloConsumer>
                {
                    (client)=>{
                        return(
                        <form onSubmit={
                            (e)=>{
                                e.preventDefault();
                                this.formSubmitHandler(client);
                            }
                            }
                        >
                            <div className="mainFormStyle">

                                <FormControl  required>
                                    <InputLabel>Audit Details By</InputLabel>
                                    <Select
                                        name="mainmenu"
                                        value={mainmenu}
                                        onChange={(e)=>this.mainmenuChangeHandler(client,e)}
                                    >
                                        <MenuItem value="lineitem">By LineItem</MenuItem>
                                        <MenuItem value="category">By Category</MenuItem>
                                        <MenuItem value="all">All Products</MenuItem>
                                    </Select>
                                </FormControl>

                                {
                                    mainmenuLoading ? (
                                        <div className="mainLoadingStyle">
                                            <CircularProgress size={70} />
                                        </div>
                                    ):(
                                        <FormControl disabled={disablesubmenu}>
                                            <InputLabel>Choose</InputLabel>
                                            <Select
                                                name="submenu"
                                                value={submenu}
                                                onChange={this.inputChangeHandler}
                                            >
                                                {
                                                    submenuData.map((el)=>{
                                                        return(
                                                            <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>
                                                        )
                                                    })
                                                }               
                                            </Select>
                                        </FormControl>
                                    )
                                }
                                
                                <Button
                                    variant="contained"
                                    type="submit"
                                    size="large"
                                    disabled={submenu || mainmenu=='all' ? false:true}
                                >Submit
                                </Button>
                            </div>
                        </form>
                        );
                    }
                }
            </ApolloConsumer>
            
            <table>
                <thead>
                    <tr className={styles.rowStyle}>
                        <th colSpan={2}>
                            <TextField 
                                label="Search By Name"
                                fullWidth
                            />
                        </th>
                        <th>
                            <TextField 
                                label="Search By Barcode"
                                fullWidth
                            />
                        </th>
                        <th>
                            <TextField 
                                label="Search By Quantity"
                                fullWidth
                            />
                        </th>
                        <th>
                            <TextField 
                                label="Search By Sell Price"
                                fullWidth
                            />
                        </th>
                        <th>
                            <TextField 
                                label="Search By WholeSale Price"
                                fullWidth
                            />
                        </th>
                    </tr>
                    <tr>
                        <th>Sr</th>
                        <th>Name</th>
                        <th>Barcode</th>
                        <th>Quantity</th>
                        <th>Sell Price</th>
                        <th>Wholesale Price</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        results.map((el,index)=>{
                            const {name,barcode,quantity,sellPrice,wholesalePrice} = el;
                            return(
                                <StockAuditTable
                                    key={index}
                                    sr={index+1}
                                    name={name}
                                    barcode={barcode}
                                    quantity={quantity}
                                    sellPrice={sellPrice}
                                    wholesalePrice={wholesalePrice}
                                />
                            )
                        })
                    }
                </tbody>
            </table>

            <ErrorDialog dialogValue={errorDialog} dialogClose={()=>this.setState({errorDialog:false})}>
                {errorMessage}
            </ErrorDialog>
            </>
        );
    }

}


export default StockAudit;