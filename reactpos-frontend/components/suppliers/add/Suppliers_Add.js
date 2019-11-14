import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';


import Intro from '../../misc/Intro';
import ErrorDialog from '../../misc/ErrorDialog';
import SnackBar from '../../misc/SnackBar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';


const CREATE_SUPPLIER_MUTATION = gql`
    mutation CREATE_SUPPLIER_MUTATION($name:String!,$email:String,$phone:String,$address:String){
        createSupplier(data:{
            name:$name,
            email:$email,
            phone:$phone,
            address:$address,
        }){
            name
        }
    }
`;



class Suppliers_Add extends Component{

    constructor(props){
        super(props);
        this.inputFieldRef = React.createRef();
    }

    state={
        supplier_name:'',
        email:'',
        phone:'',
        address:'',
        inputFocusValue:false,
        errorDialogOpen:false,
        errorMessage:'',
        snackbarOpen:false
    }

    componentDidMount(){
        this.inputFieldRef.current.focus();
        this.setState({
            inputFocusValue:true
        })
    }

    changeHandler=(e)=>{

        this.setState({
            [e.target.name]:e.target.value
        });

    }

    supplierSubmitHandler = createSupplier => async  e =>{

        e.preventDefault();
        const res = await createSupplier();
        this.setState({
            supplier_name:'',
            phone:'',
            address:'',
            email:''
        });

    }

    render(){
        const {supplier_name,
                email,
                phone,
                address,
                inputFocusValue,
                errorDialogOpen,
                errorMessage,
                snackbarOpen,
            } = this.state;
        return(
            <>

                <Intro>Add Supplier</Intro>
                
                <Mutation 
                    mutation={CREATE_SUPPLIER_MUTATION} variables={{
                    name:supplier_name,
                    email,
                    phone,
                    address
                }}
                    onCompleted={()=>this.setState({snackbarOpen:true})}
                    onError={()=>this.setState({errorDialogOpen:true,errorMessage:"The supplier already exists"})}                
                >
                    {
                        (createSupplier,{loading})=>{

                            if(loading){
                                return(
                                <div className="mainLoadingStyle">
                                     <CircularProgress size={70}  />
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
                <form onSubmit={this.supplierSubmitHandler(createSupplier)}> 
                        <div className="mainFormStyle">
                            
                            <TextField
                                name="supplier_name"
                                value={supplier_name}
                                label="Name"
                                type="text"
                                variant="outlined"
                                onChange={this.changeHandler}
                                required
                                inputRef={this.inputFieldRef}
                                autoFocus={inputFocusValue}
                            />

                            <TextField
                                name="email"
                                value={email}
                                label="email"
                                type="email"
                                variant="outlined"
                                onChange={this.changeHandler}
                            />

                            <TextField
                                name="phone"
                                value={phone}
                                label="Phone"
                                type="text"
                                variant="outlined"
                                onChange={this.changeHandler}
                            />

                            <TextField
                                name="address"
                                value={address}
                                label="Address"
                                type="text"
                                variant="outlined"
                                onChange={this.changeHandler}
                            />

                            <Button 
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    type="submit"
                                >
                                    Add
                            </Button>

                        
                        </div>
                </form>
                            )


                        }
                    }
                </Mutation>
                
                    <SnackBar snackbarValue={snackbarOpen} snackbarClose={()=>this.setState({snackbarOpen:false})}>
                        Supplier has been successfully added
                    </SnackBar>
            </>

        );
    }
}

export default Suppliers_Add;