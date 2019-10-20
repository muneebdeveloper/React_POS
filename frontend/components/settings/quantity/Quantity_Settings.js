import React,{Component} from 'react';
import gql from 'graphql-tag';
import {ApolloConsumer} from 'react-apollo';
import Router from 'next/router';

import Settings from '../Settings';

const UPDATE_QUANTITY_NOTIFICATION_SETTINGS = gql`
    mutation UPDATE_QUANTITY_NOTIFICATION_SETTINGS($quantity:Int!){
        updateSettings(where:{name:"main"},data:{quantityDays:$quantity}){
            quantityDays
        }
    }
`;

class Quantity_Settings extends Component{

    state={
        loading:false,
        errorDialog:false,
        errorMessage:'',
        snackBar:false,
        snackBarMessage:''
    }

    submitHandler = async (client,quantity)=>{

        this.setState({
            loading:true
        });

        try{
            await client.mutate({
                mutation:UPDATE_QUANTITY_NOTIFICATION_SETTINGS,
                variables:{
                    quantity:Number(quantity)
                }
            });
            this.setState({
                loading:false,
                snackBar:true,
                snackBarMessage:"Settings updated successfully"
            });
            Router.push('/');
        }catch(err){
            this.setState({
                loading:false,
                errorDialog:true,
                errorMessage:"Something went wrong"
            });
        }

    }

    render(){
        const {
            loading,
            errorDialog,
            errorMessage,
            snackBar,
            snackBarMessage
        } = this.state;
        return(
            <ApolloConsumer>
                {
                    (client)=>{
                        return(
                            <Settings
                                loading={loading}
                                errorDialog={errorDialog}
                                errorMessage={errorMessage}
                                snackBar={snackBar}
                                snackBarMessage={snackBarMessage}
                                submitHandler={(quantity)=>this.submitHandler(client,quantity)}
                                errorDialogClose={()=>this.setState({errorDialog:false})}
                                snackBarClose={()=>this.setState({snackBar:false})}
                            />
                        )
                    }
                }
            </ApolloConsumer>
        );
    }

}

export default Quantity_Settings;