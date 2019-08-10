import React, {Component} from 'react';
import {Query,Mutation,ApolloConsumer} from 'react-apollo';
import gql from 'graphql-tag';

import Supplier_ed_table from './Supplier_ed_table';


import Intro from '../../misc/Intro';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Cancel from '@material-ui/icons/Cancel';

import styles from './Supplier_ed_table.css';

const ALL_SUPPLIERS_LIST_QUERY = gql`
    query ALL_SUPPLIERS_LIST_QUERY{
        suppliers{
            id
            name
            phone
            address
        }
    }
`;

const SUPPLIER_BY_ID_QUERY = gql`
    query SUPPLIER_BY_ID_QUERY($id:ID!){
        supplier(where:{id:$id}){
            name
            phone
            address
        }
    }
`;

const UPDATE_SUPPLIER_MUTATION = gql`\
    mutation UPDATE_SUPPLIER_MUTATION($name:String!,$phone:String,$address:String,$id:ID!){
        updateSupplier(
            data:{
                name:$name,
                phone:$phone,
                address:$address
            },
            where:{
                id:$id
            }
        ){
            name
        }
    }
`;

const SUPPLIER_REMOVE_MUTATION = gql`
    mutation SUPPLIER_BY_ID_QUERY($id:ID!){
        deleteSupplier(where:{id:$id}){
            name
        }
    }
`;

class Suppliers_ed extends Component{

    state={
        dialogOpenEdit:false,
        dialogLoadingEdit:false,
        dialogOpenRemove:false,
        editId:'',
        editName:'',
        editPhone:'',
        editAddress:'',
        supplierId:''
    }

    changeHandler = (e)=>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }


    toggleDialogEdit =(value,client)=>async id=>{
        if(value){
            this.setState({
                dialogLoadingEdit:true,
                dialogOpenEdit:value,
                editId:id
            });
           const res = await client.query({
                query:SUPPLIER_BY_ID_QUERY,
                variables:{
                    id
                },
                fetchPolicy:'network-only'
            })
            const {data:{supplier:{name,phone,address}}} = res;
            this.setState({
                dialogLoadingEdit:false,
                editName:name,
                editPhone:phone,
                editAddress:address,
            });
        }else{

        this.setState({
            dialogOpenEdit:value
        });
    }
    }

    toggleDialogRemove = value => id =>{
        this.setState({
            dialogOpenRemove:value,
            supplierId:id
        })
    }
    

    supplierEditSubmitHandler = updateSupplier => async e=>{
        
        e.preventDefault();
        await updateSupplier();
        this.setState({
            editName:'',
            editPhone:'',
            editAddress:'',
            editId:'',
            dialogOpenEdit:false
        });

    }

    supplierRemoveHandler = deleteSupplier =>async e =>{
        await deleteSupplier();
        this.setState({
            dialogOpenRemove:false
        });
    }

    render(){
        const {dialogOpenEdit,editName,editId,editAddress,editPhone,dialogLoadingEdit,dialogOpenRemove,supplierId} = this.state;
        return(
            <>
                <Intro>Edit / Remove Suppliers</Intro>
                <Query query={ALL_SUPPLIERS_LIST_QUERY}>
                {
                    ({data:{suppliers},error,loading})=>{

                        if(loading){
                            return (
                                <div style={{display:"flex",justifyContent:"center"}}>
                                    <CircularProgress size={70} />
                                </div>
                            );
                        }

                        if(error){
                            return <h1>Error</h1>
                        }

                        return(
                            <>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Sr#</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Address</th>
                                        <th style={{minWidth:"81px"}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        suppliers.map((supplier,index)=>{
                                            const {id,name,phone,address} = supplier;
                                            return(
                                                <ApolloConsumer>
                                                    {
                                                        (client)=>{
                                                            return(
                                                                <Supplier_ed_table 
                                                                key={index} 
                                                                id={id}
                                                                sr={index+1} 
                                                                name={name} 
                                                                phone={phone}
                                                                address={address}
                                                                dialogHandlerEdit={this.toggleDialogEdit(true,client)}
                                                                dialogHandlerRemove={this.toggleDialogRemove(true)}
                                                             />
                                                            );
                                                        }
                                                    }
                                                </ApolloConsumer>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>

                            <Dialog open={dialogOpenEdit} onClose={this.toggleDialogEdit(false)}>

                                <div style={{padding:"16px 24px",display:"flex",alignItems:'center',justifyContent:'space-between'}}>
                                    <h2>Edit Suppliers</h2>
                                    <IconButton onClick={this.toggleDialogEdit(false)}>
                                            <Cancel className={styles.delete} />
                                    </IconButton>
                                </div>

                                <Mutation
                                    awaitRefetchQueries
                                    mutation={UPDATE_SUPPLIER_MUTATION}
                                    variables={{
                                        name:editName,
                                        phone:editPhone,
                                        address:editAddress,
                                        id:editId
                                    }}
                                    refetchQueries={
                                        [
                                            {query:ALL_SUPPLIERS_LIST_QUERY}
                                        ]
                                    }
                                    >
                                    {
                                        (updateSupplier,{loading})=>{

                                            if( loading || dialogLoadingEdit){
                                                return(
                                                    <div style={{padding:"8px 24px 20px",display:"flex",justifyContent:'center'}}>
                                                            <CircularProgress size={70} />
                                                        </div>
                                                )
                                            }
                                            
                                            return(
                                                <DialogContent>
                                                <form onSubmit={this.supplierEditSubmitHandler(updateSupplier)}>
                                                        <TextField 
                                                            label="Name"
                                                            name="editName"
                                                            type="text"
                                                            variant="outlined"
                                                            className="gutterbottomsmall"
                                                            value={editName}
                                                            onChange={this.changeHandler}
                                                            fullWidth
                                                            autoFocus
                                                        />
                                                        <TextField 
                                                            label="Phone"
                                                            name="editPhone"
                                                            type="text"
                                                            fullWidth
                                                            className="gutterbottomsmall"
                                                            value={editPhone}
                                                            onChange={this.changeHandler}
                                                            variant="outlined"
                                                        />
                                                        <TextField 
                                                            label="Address"
                                                            name="editAddress"
                                                            type="text"
                                                            value={editAddress}
                                                            onChange={this.changeHandler}
                                                            fullWidth
                                                            className="gutterbottomsmall"
                                                            variant="outlined"
                                                        />
                                                        <Button 
                                                            variant="contained"
                                                            size="large"
                                                            fullWidth
                                                            type="submit"
                                                        >
                                                            Edit
                                                        </Button>
                                                        </form>
                                                        </DialogContent>
                                                        )
                                                    }
                                                
                                            
                                        }
                                </Mutation>
                                   
                                    
                            </Dialog>
                            </>
                        )

                    }
                }
                </Query>

                <Dialog open={dialogOpenRemove} onclose={this.toggleDialogRemove(false)} >

                    <div style={{padding:"16px 24px"}}>
                        <h2>Are you sure, you want to remove this supplier?</h2>
                    </div>

                <Mutation
                    awaitRefetchQueries
                    mutation={SUPPLIER_REMOVE_MUTATION} 
                    variables={{id:supplierId}} 
                    refetchQueries={
                        [
                            {query:ALL_SUPPLIERS_LIST_QUERY}
                        ]
                    }    
                >
                    {
                        (deleteSupplier,{loading})=>{

                            if( loading ){
                                return(
                                    <div style={{padding:"8px 24px 20px",display:"flex",justifyContent:'center'}}>
                                            <CircularProgress size={70} />
                                        </div>
                                )
                            }

                            return(
                              
                                    <DialogActions>
                                        <Button 
                                            variant="contained"
                                            size="large"
                                            onClick={this.toggleDialogRemove(false)}
                                            className={styles.checkred}
                                        >
                                            Cancel
                                        </Button>
                
                                        <Button 
                                            variant="contained"
                                            size="large"
                                            onClick={this.supplierRemoveHandler(deleteSupplier)}
                                        >
                                            yes
                                        </Button>
                
                                    </DialogActions>
                               
                            )
                        }
                    }
                </Mutation>
                </Dialog>
            </>
        );
    }
}

export default Suppliers_ed;
export {ALL_SUPPLIERS_LIST_QUERY};