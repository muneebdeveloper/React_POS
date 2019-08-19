import React,{Component} from 'react';
import {Query,Mutation} from 'react-apollo';
import gql from 'graphql-tag';

import Intro from '../../misc/Intro';
import ErrorDialog from '../../misc/ErrorDialog';
import SnackBar from '../../misc/SnackBar';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';



const CREATE_CATEGORY_QUERY = gql`
    mutation CREATE_CATEGORY_QUERY($name:String!,$id:ID!){
        createCategory(data:{name:$name,lineitem:{connect:{id:$id}}}){
            name
        }
    }
`;

const FETCH_LINEITEMS_QUERY = gql`
    query FETCH_LINEITEMS_QUERY{
        lineItems{
            id
            name
        }
    }
`;

class Category extends Component{

    

    state={
        category:'',
        lineitemid:'',
        errorDialogOpen:false,
        snackbarOpen:false,
        errorMessage:''
    }


    changeHandler = (e)=>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    submitHandler = (createCategory)=>async (e)=>{
        e.preventDefault();
        createCategory();
    }

    render(){
        const {category,lineitemid,errorMessage,snackbarOpen,errorDialogOpen} = this.state;
        
        return(
            <>
            <Intro>Define a category</Intro>
            <Query 
                query={FETCH_LINEITEMS_QUERY}
                onError={
                    ()=>{
                        this.setState({
                            errorDialogOpen:true,
                            errorMessage:"something went wrong"
                        });
                    }
                }    
            >
                {   
                    ({data,loading})=>{


                            if(loading){
                                return (
                                <div className="mainLoadingStyle">
                                    <CircularProgress size={70} />
                                </div>
                                )
                            }

                            if(errorDialogOpen){
                                return(
                                <ErrorDialog dialogValue={errorDialogOpen} dialogClose={()=>this.setState({errorDialogOpen:false})}>
                                    {errorMessage}
                                </ErrorDialog>)
                            }

                        
                    return( 
                        
                        
                    <Mutation 
                        mutation={CREATE_CATEGORY_QUERY}
                        variables={{"name":category,"id":lineitemid}}
                        onCompleted={
                            ()=>{
                                this.setState({
                                    snackbarOpen:true,
                                    lineitemid:'',
                                    category:''
                                });
                            }
                        }
                        onError={
                            (error)=>{
                        
                                this.setState({
                                    errorMessage:"Something went wrong",
                                    errorDialogOpen:true
                                })
                            }
                        }
                    >
                    {   (createCategory,{loading})=>
                        {
                            
                            if(loading){
                                return (
                                    <div className="mainLoadingStyle">
                                        <CircularProgress size={70} />
                                    </div>
                                    )
                            }

                            if(errorDialogOpen){
                                return(
                                <ErrorDialog dialogValue={errorDialogOpen} dialogClose={()=>this.setState({errorDialogOpen:false})}>
                                    {errorMessage}
                                </ErrorDialog>
                                )
                            }

                            return(
                                <>
                                <form onSubmit={this.submitHandler(createCategory)}>
                                    <div className="mainFormStyle">
                                        <TextField 
                                            label="Category"
                                            variant="outlined"
                                            type="text"
                                            name="category"
                                            value={category}
                                            required
                                            autoFocus
                                            onChange={this.changeHandler}
                                        />

                                        <FormControl required>
                                            <InputLabel>Select Line Item</InputLabel>
                                            <Select
                                                name="lineitemid"
                                                value={lineitemid}
                                                onChange={this.changeHandler}
                                            >
                                               
                                                {   Object.keys(data).length>0 &&
                                                     data.lineItems.map((lineitem)=>{
                                                        return(
                                                            <MenuItem key={lineitem.id} value={lineitem.id}>{lineitem.name}</MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </FormControl >
                                      
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                        >
                                            Create
                                        </Button>
                                    </div>
                                
                                </form>
                                
                                </>
                            );
                        }
                    }
                </Mutation>
                );
                        
                }   
                }     
            </Query>
            <SnackBar snackbarValue={snackbarOpen} snackbarClose={()=>this.setState({snackbarOpen:false})}>
                The category has been successfully created
            </SnackBar>
            
            </>
        );
    }
}


export default Category;
export {FETCH_LINEITEMS_QUERY};