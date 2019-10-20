import React, {Component} from 'react';
import {Query,ApolloConsumer} from 'react-apollo';
import gql from 'graphql-tag';

import ErrorDialog from '../../misc/ErrorDialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import styles from './Profit_Sales.css';

import {FETCH_LINEITEMS_QUERY} from '../../stock/define/Category';
import {EXPENSES_BY_DATE_QUERY} from '../../expense/summary/Summary_Expense';


const ALL_CATEGORIES_QUERY = gql`
    query ALL_CATEGORIES_QUERY{
        categories{
            id
            name
        }
    }
`;

const ALL_PRODUCTS_QUERY = gql`
    query ALL_PRODUCTS_QUERY{
        products{
            id
            name
        }
    }
`;

const SALESITEM_BY_DATE_QUERY_ALL = gql`
    query SALESITEM_BY_DATE_QUERY_ALL($dateStart:DateTime,$dateEnd:DateTime){
        salesItems(where:{
            AND:[
                {createdAt_gte:$dateStart},
                {createdAt_lte:$dateEnd}
            ]
        }){
            noofpieces
            priceSold
            type
            profit
            discount
            product{
                name
            }
        }
    }
`;

const SALESITEM_BY_DATE_QUERY_PRODUCT = gql`
    query SALESITEM_BY_DATE_QUERY_PRODUCT($dateStart:DateTime,$dateEnd:DateTime,$id:ID){
        salesItems(where:{
            AND:[
                {createdAt_gte:$dateStart},
                {createdAt_lte:$dateEnd},
                {product:{
                    id:$id
                    }
                }
            ]
        }){
            noofpieces
            priceSold
            type
            profit
            discount
            product{
                name
            }
        }
    }
`;

const SALESITEM_BY_DATE_QUERY_CATEGORY = gql`
    query SALESITEM_BY_DATE_QUERY_CATEGORY($dateStart:DateTime,$dateEnd:DateTime,$id:ID){
        salesItems(where:{
            AND:[
                {createdAt_gte:$dateStart},
                {createdAt_lte:$dateEnd},
                {product:{
                    category:{
                        id:$id
                    }
                }}
            ]
        }){
            noofpieces
            priceSold
            type
            profit
            discount
            product{
                name
            }
        }
    }
`;

const SALESITEM_BY_DATE_QUERY_LINEITEM = gql`
    query SALESITEM_BY_DATE_QUERY_LINEITEM($dateStart:DateTime,$dateEnd:DateTime,$id:ID){
        salesItems(where:{
            AND:[
                {createdAt_gte:$dateStart},
                {createdAt_lte:$dateEnd},
                {product:{
                    category:{
                        lineitem:{
                            id:$id
                        }
                    }
                }
                }
            ]
        }){
            noofpieces
            priceSold
            type
            profit
            discount
            product{
                name
            }
        }
    }
`;


class Profit_Sales extends Component{

    state={
        mainmenu:'',
        submenu:'',
        dateStart:'',
        dateEnd:'',
        mainmenuSelectionLoading:false,
        salesResultLoading:false,
        subSelect:[],
        salesResult:[],
        errorDialogOpen:false,
        errorMessage:'',
        disableSubMenu:true,
        totalBuyPrice:0,
        totalSellPrice:0,
        totalDiscount:0,
        totalProfit:0,
        totalQuantity:0,
        totalSale:0,
        totalExpense:0
    }

    changeHandler = (e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    mainmenuHandler = (client)=>async (e)=>{
        let res;
        this.setState({
            mainmenu:e.target.value,
            mainmenuSelectionLoading:true
        });
        switch(e.target.value){

            case "all":
                this.setState({
                    mainmenuSelectionLoading:false,
                    disableSubMenu:true
                })
                break;
            case "lineitem":
                try{
                    res = await client.query({
                        query:FETCH_LINEITEMS_QUERY
                    });
                    this.setState({
                        subSelect:res.data.lineItems,
                        mainmenuSelectionLoading:false,
                        disableSubMenu:false
                    })
                    break;
                }catch(err){
                    this.setState({
                        errorDialogOpen:true,
                        errorMessage:"Something went wrong",
                        mainmenuSelectionLoading:false
                    });
                    break;
                }
            case "category":
                try{
                    res = await client.query({
                        query:ALL_CATEGORIES_QUERY
                    });
                    this.setState({
                        subSelect:res.data.categories,
                        mainmenuSelectionLoading:false,
                        disableSubMenu:false
                    })
                    break;
                }catch(err){
                    this.setState({
                        errorDialogOpen:true,
                        errorMessage:"Something went wrong",
                        mainmenuSelectionLoading:false
                    });
                    break;
                }
            case "product":
                try{
                    res = await client.query({
                        query:ALL_PRODUCTS_QUERY
                    });
                    this.setState({
                        subSelect:res.data.products,
                        mainmenuSelectionLoading:false,
                        disableSubMenu:false
                    })
                    break;
                }catch(err){
                    this.setState({
                        errorDialogOpen:true,
                        errorMessage:"Something went wrong",
                        mainmenuSelectionLoading:false
                    });
                    break;
                }

        }
    }

    salesProfitFormSubmitHandler = (client)=>async (e)=>{
        e.preventDefault();
        const {dateStart,dateEnd,mainmenu,submenu} = this.state;
        let res;
        this.setState({
            salesResultLoading:true
        })

        try{
            switch(mainmenu){

                case "all":
                        res = await client.query({
                        query:SALESITEM_BY_DATE_QUERY_ALL,
                        variables:{
                            dateStart,
                            dateEnd,
                        }
                        });
                        break;
                
                case "product":
                        res = await client.query({
                        query:SALESITEM_BY_DATE_QUERY_PRODUCT,
                        variables:{
                            dateStart,
                            dateEnd,
                            id:submenu
                        }
                        });
                        break;
                
                case "category":
                        res = await client.query({
                        query:SALESITEM_BY_DATE_QUERY_CATEGORY,
                        variables:{
                            dateStart,
                            dateEnd,
                            id:submenu
                        }
                        });
                        break;

                case "lineitem":
                        res = await client.query({
                        query:SALESITEM_BY_DATE_QUERY_LINEITEM,
                        variables:{
                            dateStart,
                            dateEnd,
                            id:submenu
                        }
                        });
                        break;

                        
            }
           let calcExpenseAmount = 0;
           let expenseRes = await client.query({
                query:EXPENSES_BY_DATE_QUERY,
                variables:{
                    start_date:dateStart,
                    end_date:dateEnd
                }
            });
            expenseRes.data.expenses.map((el)=>{
                calcExpenseAmount += el.amount;
            });
            let calcBuyPrice=0,calcpriceSold=0,calcSale=0,calcQuantity=0,calcProfit=0,calcDiscount=0;
            res.data.salesItems.map((item)=>{
                if(item.noofpieces>0){
                    calcpriceSold = calcpriceSold + item.priceSold;
                    calcProfit = calcProfit + item.profit;
                    calcQuantity = calcQuantity + item.noofpieces;
                    item.sale = item.noofpieces * item.priceSold;
                    calcSale = calcSale + item.sale;
                    calcDiscount= calcDiscount + item.discount;
                    calcProfit = calcProfit - item.discount;
                }
                
            });
            calcProfit -= calcExpenseAmount; 
            this.setState({
                salesResult:[...res.data.salesItems],
                salesResultLoading:false,
                totalDiscount:calcDiscount,
                totalBuyPrice:calcBuyPrice,
                totalSellPrice:calcpriceSold,
                totalProfit:calcProfit,
                totalQuantity:calcQuantity,
                totalSale:calcSale,
                totalExpense:calcExpenseAmount
            })
        }catch(err){
            this.setState({
                errorMessage:"Something went wrong"+err,
                errorDialogOpen:true,
                salesResultLoading:false
            })
        }
        
    }

    render(){
        const { mainmenu,
                submenu,
                disableSubMenu,
                dateStart,
                dateEnd,
                mainmenuSelectionLoading,
                subSelect,
                salesResultLoading,
                salesResult,
                errorMessage,
                errorDialogOpen,
                totalDiscount,
                totalSellPrice,
                totalQuantity,
                totalSale,
                totalProfit,
                totalExpense
        } = this.state;

        return(
            <>
            <ApolloConsumer>
                {
                    client=>{

                        if(salesResultLoading){
                            return(
                                <div className="mainLoadingStyle">
                                    <CircularProgress size={70} />
                                </div>
                            );
                        }
                        return(
                            <form onSubmit={this.salesProfitFormSubmitHandler(client)}>
                    <div className="mainFormStyle">

                        <FormControl required>
                            <InputLabel>Sales Profit by</InputLabel>
                            <Select
                                name="mainmenu"
                                value={mainmenu}
                                onChange={this.mainmenuHandler(client)}
                            >                          
                                <MenuItem value={'all'}>All</MenuItem>
                                <MenuItem value={'lineitem'}>LineItem</MenuItem>
                                <MenuItem value={'category'}>Category</MenuItem>
                                <MenuItem value={'product'}>Product</MenuItem>
                            </Select>
                                              
                        </FormControl>
                        {
                            mainmenuSelectionLoading ?
                            (<div className="mainLoadingStyle">
                                <CircularProgress size={70} />
                            </div>):
                            (
                            <FormControl required disabled={disableSubMenu}>
                                <InputLabel>Choose</InputLabel>
                
                                <Select
                                    name="submenu"
                                    value={submenu}
                                    onChange={this.changeHandler}
                                >
                                    {
                                        subSelect.map(
                                            (sub,index)=>{
                                                return(
                                                    <MenuItem key={index} value={sub.id}>{sub.name}</MenuItem>
                                                )
                                            }
                                        )
                                    }
                                </Select>
                                              
                            </FormControl>
                            )
                        }                    
                       
                        <TextField
                            label="Choose Start date"
                            name="dateStart"
                            value={dateStart}
                            onChange={this.changeHandler}
                            InputLabelProps={{
                                shrink:true
                            }}
                            type="date"
                        />

                        <TextField
                            label="Choose End date"
                            name="dateEnd"
                            value={dateEnd}
                            onChange={this.changeHandler}
                            InputLabelProps={{
                                shrink:true
                            }}
                            type="date"
                        />

                        <Button 
                            type="submit"
                            variant="contained"
                            size="large"
                        >
                            Submit
                        </Button>
                    </div>
                </form>
                        )
                    }
                }
            </ApolloConsumer>
            <div className="gutterbottom">
            <table>
                <thead>
                    <tr>
                        <th>sr</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Sale</th>
                        <th>Profit</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        salesResult.map((item,index)=>{
                            const {noofpieces,type,priceSold,sale,profit,product:{name}} = item;
                            if(noofpieces>0){
                                return(
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{name}</td>
                                        <td>{type}</td>
                                        <td>{priceSold}</td>
                                        <td>{noofpieces}</td>
                                        <td>{sale}</td>
                                        <td>{profit}</td>
                                    </tr>
                                )
                            }
                            return;
                        })
                    }
                </tbody>
                <tfoot >
                        <tr className={styles.tableFoot}>
                            <td colSpan={6} className={styles.totalRow}>Expense</td>
                            <td>{totalExpense==0?totalExpense:`-${totalExpense}`}</td>
                        </tr>
                        <tr className={styles.tableFoot}>
                            <td colSpan={6} className={styles.totalRow}>Discount</td>
                            <td>{totalDiscount==0?totalDiscount:`-${totalDiscount}`}</td>
                        </tr>
                                <tr className={styles.tableFoot}>
                                    <td colSpan={3} className={styles.totalRow}>Total</td>
                                    <td>{totalSellPrice}</td>
                                    <td>{totalQuantity}</td>
                                    <td>{totalSale}</td>
                                    <td>{totalProfit}</td>
                                </tr>
                        </tfoot>
            </table>
            </div>
                <ErrorDialog dialogValue={errorDialogOpen} dialogClose={()=>this.setState({errorDialogOpen:false})}>
                    {errorMessage}
                </ErrorDialog>
            </>
        );
    }
}

export default Profit_Sales;