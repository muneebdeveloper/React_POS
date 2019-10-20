import React,{Component} from 'react';
import {ApolloConsumer} from 'react-apollo';
import gql from 'graphql-tag';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import Summary_Expense_Detail from './Summary_Expense_Detail';


const EXPENSES_BY_DATE_QUERY = gql`
    query EXPENSES_BY_DATE_QUERY($start_date:DateTime,$end_date:DateTime){
        expenses(where:{
            AND:[
                {createdAt_gte:$start_date},
                {createdAt_lte:$end_date}
            ]
        }){
            createdAt
            description
            amount
        }
    }
`;

class Summary_Expense extends Component{

    state={
        start_date:'',
        end_date:'',
        expenseLoading:false,
        expenseResults:[]
    }

    changeHandler=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    expenseSubmitHandler = (client)=>async (e)=>{
        e.preventDefault();
        const {start_date,end_date}=this.state;
        this.setState({
            expenseLoading:true
        });
        const res = await client.query({
            query:EXPENSES_BY_DATE_QUERY,
            variables:{
                start_date,
                end_date
            }
        });
        this.setState({
            expenseLoading:false,
            expenseResults:[...res.data.expenses]
        });

    }

    render(){
        const {
            start_date,
            end_date,
            expenseLoading,
            expenseResults
        } = this.state;
        return(
            <>
            <ApolloConsumer>
                {
                    (client)=>{

                        if(expenseLoading){
                            return(
                                <div className="mainLoadingStyle">
                                    <CircularProgress size={70} />
                                </div>
                            )
                        }

                        return(
                            <form onSubmit={this.expenseSubmitHandler(client)}>
                                <div className="mainFormStyle">
                                    <TextField 
                                        label="Start Date"
                                        name="start_date"
                                        type="date"
                                        onChange={this.changeHandler}
                                        value={start_date}
                                        InputLabelProps={{
                                            shrink:true
                                        }}
                                    />
                                    <TextField
                                        label="End Date"
                                        type="date"
                                        name="end_date"
                                        onChange={this.changeHandler}
                                        value={end_date}
                                        InputLabelProps={{
                                            shrink:true
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        size="large"
                                        type="submit"
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </form>
                        );
                    }
                }
            </ApolloConsumer>
            <table>
                <thead>
                    <tr style={{backgroundColor:"black",color:"white"}}>
                        <th>Sr#</th>
                        <th>Created At</th>
                        <th>Description</th>
                        <th>Amount</th>
                    </tr>
                </thead>
               <tbody>
                   {
                      expenseResults.map(
                          (result,index)=>{
                              const {createdAt,description,amount}=result;
                              return(
                                  <Summary_Expense_Detail 
                                    sr={index+1}
                                    createdAt={createdAt}
                                    description={description}
                                    amount={amount}
                                  />
                              )
                          }
                      ) 
                   }
               </tbody>
            </table>
            </>
        );
    }
}

export default Summary_Expense;
export {EXPENSES_BY_DATE_QUERY};