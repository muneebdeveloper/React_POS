import React,{Component} from 'react';
import gql from 'graphql-tag';
import {ApolloConsumer} from 'react-apollo';

import Settings from '../Settings';

const UPDATE_EXPIRY_NOTIFICATION_SETTINGS = gql`
    mutation UPDATE_EXPIRY_NOTIFICATION_SETTINGS($expiryDays:Int!){
        updateSettings(where:{name:"main"},data:{expiryDays:$expiryDays}){
            expiryDays
        }
    }
`;

class Expiry_Settings extends Component{

    state={
        loading:false,
        errorDialog:false,
        errorMessage:'',
        snackBar:false,
        snackBarMessage:''
    }

    submitHandler = async (client,expiryDays)=>{

        this.setState({
            loading:true
        });

        try{
            await client.mutate({
                mutation:UPDATE_EXPIRY_NOTIFICATION_SETTINGS,
                variables:{
                    expiryDays:Number(expiryDays)
                }
            });
            this.setState({
                loading:false,
                snackBar:true,
                snackBarMessage:"Settings updated successfully"
            });
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
                                submitHandler={(expiryDays)=>this.submitHandler(client,expiryDays)}
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

export default Expiry_Settings;