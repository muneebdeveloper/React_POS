import React,{Component} from 'react';
import gql from 'graphql-tag';
import {Query,ApolloConsumer} from 'react-apollo';


import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';

import CancelIcon from '@material-ui/icons/cancel';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import ErrorDialog from '../../../misc/ErrorDialog';
import EditDialog from './EditDialog';
import RemoveDialog from './RemoveDialog';

import styles from '../../../main.css';


const FETCH_CATEGORIES_QUERY = gql`
    query FETCH_CATEGORIES_QUERY{
        categories{
            id
            name
        }
    }
`;


const CATEGORIES_SEARCH_QUERY = gql`
    query CATEGORIES_SEARCH_QUERY($search:String!){
        categories(where:{name_contains:$search}){
            id
            name
        }
    }
`;

class CategorySummary extends Component{

    state={
        dialogError:false,
        searchLoading:false,
        errorMessage:'',
        dialogEdit:false,
        dialogRemove:false,
        editID:'',
        editName:'',
        removeID:'',
        results:[]
    }

    searchHandler = async(client,e)=>{

        this.setState({
            searchLoading:true
        });

        try{
            let res = await client.query({
                query:CATEGORIES_SEARCH_QUERY,
                variables:{
                    search:e.target.value
                }
            });
            this.setState({
                results:[...res.data.categories],
                searchLoading:false,
            });
        }catch(err){       
            this.setState({
                dialogError:true,
                searchLoading:false,
                errorMessage:"something went wrong",
            })
        }
        

    }

    render(){

        const {
            results,
            searchLoading,
            dialogEdit,
            dialogRemove,
            editID,
            editName,
            removeID,
            dialogError,
            errorMessage
            } = this.state;

        return(
            <>
            <Query 
                query={FETCH_CATEGORIES_QUERY}
                onCompleted={
                    (data)=>{
                        this.setState({
                            results:[...data.categories]
                        })
                    }
                }
                onError={(err)=>{

                }}
            >
                {
                    ({data,loading})=>{

                        if(loading){
                            return(
                                <div className="mainLoadingStyle">
                                    <CircularProgress size={70} />
                                </div>
                            );
                        }

                        return(
                            <ApolloConsumer>
                                {
                                    (client)=>{
                                        return(
                        <>
                            <table>
                                <thead>
                                    <tr>
                                        <th colSpan={3} style={{backgroundColor:"white"}}>
                                            <TextField 
                                                label="Search By Name"
                                                fullWidth
                                                placeholder="Search by name"
                                                onChange={(e)=>this.searchHandler(client,e)}
                                                autoFocus
                                            />
                                            </th>
                                        </tr>
                                    <tr>
                                        <th>Sr#</th>
                                        <th>Name</th>
                                        <th style={{minWidth:"81px"}}>Actions</th>
                                    </tr>
                                </thead>
                                {
                                    !searchLoading && (
                                <tbody>
                                {
                                    results.map((lineitem,index)=>{
                                        const {id,name} = lineitem;
                                            return(
                                                <tr key={index}>
                                                    <td>{index+1}</td>
                                                    <td>{name}</td>
                                                    <td style={{textAlign:"center"}}>
                                                        <IconButton size="small" onClick={()=>this.setState({editID:id,editName:name,dialogEdit:true})}>
                                                            <EditIcon className={styles.edit} />
                                                        </IconButton>
                                        
                                                        <IconButton size="small" onClick={()=>this.setState({removeID:id,dialogRemove:true})}>
                                                            <DeleteIcon className={styles.delete} />
                                                        </IconButton>                 
                                                    </td>
                                                </tr>
                                                );
                                            }
                                        )    
                                }
                                </tbody>
                                    )
                                }
                                
                            </table>
                            {
                                searchLoading && (
                                    <div className="mainLoadingStyle" style={{marginTop:"30px"}}>
                                        <CircularProgress size={45} />
                                    </div>
                                )
                            }{  results.length<=0 && (
                                <h2 style={{textAlign:"center",marginTop:"10px"}}>Nothing Found</h2>)
                            }
                            
                        </>
                                        )
                                    }
                                }
                            </ApolloConsumer>   
                        )
                    }
                }
            </Query>

            {/* Dialog Starts Here */}

                {/* Edit Dialog */}
                    <Dialog open={dialogEdit} onClose={()=>this.setState({dialogEdit:false})}>

                        <div className="dialogTitleStyle">
                                <h2>Edit LineItem</h2>
                                <IconButton onClick={()=>this.setState({dialogEdit:false})}>
                                        <CancelIcon className={styles.delete} />
                                </IconButton>
                        </div>

                        <DialogContent>
                            <EditDialog
                                dialogClose={()=>this.setState({dialogEdit:false})}
                                id={editID}
                                name={editName}
                            />
                        </DialogContent>
                    </Dialog>

                {/* Remove Dialog */}
                <Dialog open={dialogRemove} onClose={()=>this.setState({dialogRemove:false})}>

                        <div className="dialogTitleStyle">
                                <h2>Are you sure, you want to remove this product?</h2>
                                <IconButton onClick={()=>this.setState({dialogRemove:false})}>
                                        <CancelIcon className={styles.delete} />
                                </IconButton>
                        </div>

                        <DialogContent>
                            <RemoveDialog
                                dialogClose={()=>this.setState({dialogRemove:false})}
                                dialogError={(message)=>this.setState({dialogError:true,errorMessage:message})}
                                id={removeID}
                            />
                        </DialogContent>
                </Dialog>

                {/* Error Dialog */}
                <ErrorDialog dialogValue={dialogError} dialogClose={()=>this.setState({dialogError:false})}>
                    {errorMessage}
                </ErrorDialog>
            </>             
        );
    }

}


export default CategorySummary;
export {FETCH_CATEGORIES_QUERY};