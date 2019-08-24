import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';

import styles from './Add_Expense.css';

import Intro from '../../misc/Intro';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import Add_Expense_Detail from './Add_Expense_Detail';



const CREATE_EXPENSE_MUTATION = gql`
    mutation CREATE_EXPENSE_MUTATION($description:String!,$price:Float!){
        createExpense(
            data:{
                description:$description,
                price:$price
            }
        ){
            price
        }
    }
`;


class Add_Expense extends Component{

    state={
        description:'',
        amount:'',
        expenseDetail:[]
    }

    inputChangeHandler = e =>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    expenseSubmitHandler = (createExpense)=>async (e)=>{
        e.preventDefault();
        await createExpense();
        const expenseDetailArray = [...this.state.expenseDetail,{
            description:this.state.description,
            amount:this.state.amount
        }];
        this.setState({
            description:'',
            amount:'',
            expenseDetail:[...expenseDetailArray]
        })

    }


    render(){
        const { description,
                amount,
                expenseDetail
              } = this.state;

        return(
            <>
            <Intro>Add Expense</Intro>
            <Mutation 
                mutation={CREATE_EXPENSE_MUTATION}
                variables={{
                    description,
                    price:Number(amount)
                }}    
            >
                {
                    (createExpense,{loading})=>{
                        if(loading){
                            return(
                                <div className="mainLoadingStyle">
                                    <CircularProgress size={70} />
                                </div>
                            );
                        }

                        return(
                            <>
                            <form onSubmit={this.expenseSubmitHandler(createExpense)} style={{marginBottom:"30px"}}>
                <div style={{display:"flex",flexFlow:"column",alignItems:"center"}}>
                    <TextField
                        label="Description"
                        variant="outlined"
                        name="description"
                        required
                        type="text"
                        value={description}
                        autoFocus
                        className={`${styles.width50} ${styles.marginbottom30}`}
                        onChange={this.inputChangeHandler}
                    />
                    <TextField 
                        label="Amount"
                        variant="outlined"
                        name="amount"
                        required
                        type="number"
                        value={amount}
                        className={`${styles.width50} ${styles.marginbottom30}`}
                        onChange={this.inputChangeHandler}
                    />
                    <div className={styles.width50}>
                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        size="large"
                    >
                        Add
                    </Button>
                    </div>
                    
                </div>
            </form>
            <table>
                <thead>
                    <tr style={{backgroundColor:"black",color:"white"}}>
                        <th>Sr#</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        expenseDetail.map((detail,index)=>{
                            const {description,amount}=detail;
                            return(
                                <Add_Expense_Detail 
                                    sr={index+1}
                                    description={description}
                                    amount={amount}    
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
            </Mutation>
            </>
        );
    }

}

export default Add_Expense;