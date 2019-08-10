import React, {Component} from 'react';
import {Mutation} from 'react-apollo';

import gql from 'graphql-tag';

import styles from './Suppliers_Add.css';

import Intro from '../../misc/Intro';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';


const CREATE_SUPPLIER_MUTATION = gql`
    mutation CREATE_SUPPLIER_MUTATION($name:String!,$phone:String,$address:String){
        createSupplier(data:{
            name:$name,
            phone:$phone,
            address:$address,
        }){
            name
        }
    }
`;



class Suppliers_Add extends Component{

    state={
        supplier_name:'',
        phone:'',
        address:'',
        checkShow:false
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
            address:''
        });

    }
    componentDidMount(){
        this.setState({
            checkShow:true
        });
    }


    render(){
        const {supplier_name,phone,address,checkShow} = this.state;
        return(
            <>

                <Intro>Add Supplier</Intro>
                
                <Mutation mutation={CREATE_SUPPLIER_MUTATION} variables={{
                    name:supplier_name,
                    phone,
                    address
                }}>
                    {
                        (createSupplier,{loading})=>{

                            if(loading){
                                return(
                                <div className={styles.maindiv}>
                                     <CircularProgress size={70}  />
                                </div>
                               )
                            }

                            return(
                <form onSubmit={this.supplierSubmitHandler(createSupplier)}> 
                        <div className={styles.maindiv}>
                            
                            {checkShow &&
                            <TextField
                                name="supplier_name"
                                value={supplier_name}
                                label="Name"
                                variant="outlined"
                                onChange={this.changeHandler}
                                className={styles.width50}
                                autoFocus
                            />
                            }

                            <TextField
                                name="phone"
                                value={phone}
                                label="Phone"
                                variant="outlined"
                                onChange={this.changeHandler}
                                className={styles.width50}
                            />

                            <TextField
                                name="address"
                                value={address}
                                label="Address"
                                variant="outlined"
                                onChange={this.changeHandler}
                                className={styles.width50}
                            />

                            <div className={styles.width50}>
                                <Button 
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    type="submit"
                                >
                                    Add
                                </Button>
                            </div>

                        
                        </div>
                </form>
                            )


                        }
                    }
                </Mutation>
                

            </>

        );
    }
}

export default Suppliers_Add;