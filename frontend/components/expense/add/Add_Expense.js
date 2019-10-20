import React, {Component} from 'react';
import {Mutation,ApolloConsumer} from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import styles from './Add_Expense.css';

import ErrorDialog from '../../misc/ErrorDialog';
import SnackBar from '../../misc/SnackBar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from '@material-ui/core/DialogActions';
import CancelIcon from '@material-ui/icons/Cancel';

import Add_Expense_Detail from './Add_Expense_Detail';



const CREATE_EXPENSE_MUTATION = gql`
    mutation CREATE_EXPENSE_MUTATION($description:String!,$amount:Float!){
        createExpense(
            data:{
                description:$description,
                amount:$amount
            }
        ){
            id
        }
    }
`;

const EXPENSE_ITEM_QUERY = gql`
    query EXPENSE_ITEM_QUERY($id:ID!){
        expense(where:{id:$id}){
            description
            amount
        }
    }
`;

const UPDATE_EXPENSE_MUTATION = gql`
    mutation UPDATE_EXPENSE_MUTATION($id:ID!,$description:String!,$amount:Float!){
        updateExpense(
            data:{
                description:$description,
                amount:$amount
            },
            where:{
                id:$id
            }
        ){
            amount
        }
    }
`;

const REMOVE_EXPENSE_MUTATION = gql`
    mutation REMOVE_EXPENSE_MUTATION($id:ID!){
        deleteExpense(where:{id:$id}){
            id
        }
    }
`;

class Add_Expense extends Component{

    state={
        description:'',
        amount:'',
        expenseDetail:[],
        editDialogOpen:false,
        edit_id:'',
        edit_index:'',
        edit_description:'',
        edit_amount:'',
        editDialogLoading:false,
        errorDialogOpen:false,
        errorMessage:'',
        removeDialogLoading:false,
        removeDialogOpen:false
    }

    inputChangeHandler = e =>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    expenseSubmitHandler = (createExpense)=>async (e)=>{
        e.preventDefault();
        const res = await createExpense();
        const expenseDetailArray = [...this.state.expenseDetail,{
            id:res.data.createExpense.id,
            description:this.state.description,
            amount:this.state.amount
        }];
        this.setState({
            description:'',
            amount:'',
            expenseDetail:[...expenseDetailArray]
        })

    }

    editDialogHandler = (client)=>async (id,index)=>{
        
        this.setState({
            editDialogOpen:true,
            editDialogLoading:true
        });
        try{
            const res = await client.query({
                query:EXPENSE_ITEM_QUERY,
                variables:{
                    id
                }
            });
            this.setState({
                editDialogLoading:false,
                edit_id:id,
                edit_index:index,
                edit_description:res.data.expense.description,
                edit_amount:res.data.expense.amount
            })
        }catch(e){
            this.setState({
                editDialogLoading:false,
                editDialogOpen:false,
                errorMessage:"Something went wrong",
                errorDialogOpen:true
            })
        }
      
    }

    formEditDialogHandler = (client)=>async (e)=>{
        e.preventDefault();
        const {edit_index,edit_id,edit_amount,edit_description,expenseDetail}=this.state;
        this.setState({
            editDialogLoading:true,
        });
        try{
            await client.mutate({
                mutation:UPDATE_EXPENSE_MUTATION,
                variables:{
                    amount:Number(edit_amount),
                    description:edit_description,
                    id:edit_id
                }
            });
            let objectToEdit = expenseDetail[edit_index];
            objectToEdit.amount=edit_amount;
            objectToEdit.description = edit_description;
            this.setState((state)=>{
                state.expenseDetail[edit_index] = objectToEdit;
                return{
                    editDialogLoading:false,
                    editDialogOpen:false
                }
            })
        }catch(e){
            this.setState({
                editDialogLoading:false,
                editDialogOpen:false,
                errorMessage:"Something went wrong",
                errorDialogOpen:true
            })
        }
        
    }

    formRemoveDialogHandler = (client)=>async ()=>{
        const {edit_id,edit_index} = this.state;
        this.setState({
            removeDialogLoading:true
        });
        try{
            await client.mutate({
                mutation:REMOVE_EXPENSE_MUTATION,
                variables:{
                    id:edit_id
                }
            });
            this.setState((state)=>{
                state.expenseDetail.splice(edit_index,1);
                return{
                    removeDialogLoading:false,
                    removeDialogOpen:false
                }
            })
        }catch(e){
            this.setState({
                removeDialogLoading:false,
                removeDialogOpen:false,
                errorMessage:"Something went wrong",
                errorDialogOpen:true
            })
        }

    }

    render(){
        const { description,
                amount,
                expenseDetail,
                editDialogOpen,
                edit_description,
                edit_amount,
                editDialogLoading,
                removeDialogLoading,
                removeDialogOpen,
                errorDialogOpen,
                errorMessage
              } = this.state;

        return(
            <>
             <ApolloConsumer>
                {
                    (client)=>{
                        return(
                            <>
           
            <Mutation 
                mutation={CREATE_EXPENSE_MUTATION}
                variables={{
                    description,
                    amount:Number(amount)
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
            <table className="gutterbottomsmall">
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
                            const {id,description,amount}=detail;
                            return(
                                <Add_Expense_Detail 
                                    sr={index+1}
                                    key={index}
                                    id={id}
                                    index={index}
                                    description={description}
                                    amount={amount}
                                    editDialogHandler={this.editDialogHandler(client)}
                                    removeDialogHandler={(id,index)=>this.setState({removeDialogOpen:true,edit_id:id,edit_index:index})}
                                />                                
                            )
                        })
                    }
                </tbody>
            </table>
            <DialogActions>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={()=>Router.push('/')}
                    >
                        Submit
                    </Button>
            </DialogActions>
            </>
                        )
                    }
                }
            </Mutation>

           
                            <Dialog open={editDialogOpen} onClose={()=>this.setState({editDialogOpen:false})}>
                            <div className="dialogTitleStyle">
                                <h2>Edit Expense</h2>
                                <IconButton onClick={()=>this.setState({editDialogOpen:false})}>
                                    <CancelIcon className={styles.delete} />
                                </IconButton>
                            </div>
                            <form onSubmit={this.formEditDialogHandler(client)}>
                                {
                                    editDialogLoading ?(
                                        <div className="dialogLoadingStyle">
                                            <CircularProgress size={70} />
                                        </div>
                                    ):(
                                        <>
                                <DialogContent className={styles.dialogMargin}>
                                    <TextField 
                                        label="Descrtiption"
                                        name="edit_description"
                                        variant="outlined"
                                        value={edit_description}
                                        onChange={this.inputChangeHandler}
                                        autoFocus
                                        required
                                        fullWidth
                                    />
                                    <TextField 
                                        label="Amount"
                                        name="edit_amount"
                                        variant="outlined"
                                        value={edit_amount}
                                        required
                                        onChange={this.inputChangeHandler}
                                        fullWidth
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        size="large"
                                    >
                                        Submit
                                    </Button>
                                </DialogActions>
                                </>
                                    )
                                }
                            </form>
                        </Dialog>
            
                        <Dialog open={removeDialogOpen} onClose={()=>this.setState({removeDialogOpen:false})} >
            
                            <div className="dialogTitleStyle">
                                <h2>Are you sure, you want to remove this expense item?</h2>
                            </div>
                            
                            {
                                removeDialogLoading ? (
                                    <div className="dialogLoadingStyle">
                                        <CircularProgress size={70} />
                                    </div>
                                ):(
                                    <DialogActions>
                                    <Button 
                                        variant="contained"
                                        size="large"
                                        onClick={()=>this.setState({removeDialogOpen:false})}
                                        className={styles.deleteButton}
                                    >
                                        Cancel
                                    </Button>
                
                                    <Button 
                                        variant="contained"
                                        size="large"
                                        onClick={this.formRemoveDialogHandler(client)}
                                    >
                                        yes
                                    </Button>
                
                                </DialogActions>
                                )
                            }
                            
                        </Dialog>
                        </>
                        );
                    }
                }
            </ApolloConsumer>
            <ErrorDialog dialogValue={errorDialogOpen} dialogClose={()=>this.setState({errorDialogOpen:false})}>
                {errorMessage}
            </ErrorDialog>
      
            </>
        );
    }

}

export default Add_Expense;