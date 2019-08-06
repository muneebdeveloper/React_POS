import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';

import styles from './Suppliers_Add.css';

import Intro from '../../misc/Intro';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


const CREATE_SUPPLIER_MUTATION = gql`
    mutation CREATE_SUPPLIER_MUTATION($name:String!,$phone:String!,$address:String!){

    }
`;



class Suppliers_Add extends Component{

    state={
        supplier_name:'',
        phone:'',
        address:'',
    }

    changeHandler=(e)=>{

        this.setState({
            [e.target.name]:e.target.value
        });

    }

    render(){
        const {supplier_name,phone,address} = this.state;
        return(
            <>

                <Intro>Add Supplier</Intro>

                <form onSubmit={(e)=>e.preventDefault()}> 
                        <div className={styles.maindiv}>


                            <TextField
                                name="supplier_name"
                                value={supplier_name}
                                label="Name"
                                variant="outlined"
                                onChange={this.changeHandler}
                                className={styles.width50}
                            />

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
                                    disabled
                                >
                                    Add
                                </Button>
                            </div>

                        
                        </div>
                </form>

            </>

        );
    }
}

export default Suppliers_Add;