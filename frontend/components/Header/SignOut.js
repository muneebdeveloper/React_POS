import React from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import {CURRENT_USER_QUERY} from '../CurrentUser';


const SIGNOUT_MUTATION = gql`
    mutation SIGNOUT_MUTATION{
        signout{
            message
        }
    }
`;

const SignOut = (props)=>{
    return(
        <Mutation 
            awaitRefetchQueries
            mutation={SIGNOUT_MUTATION}
            onCompleted={
                ()=>{
                    Router.push('/login');
                }
            }
            refetchQueries={[
                {query:CURRENT_USER_QUERY}
            ]}
        >
            {
                (signout,{loading})=>{

                    if(loading){
                        return(
                            <CircularProgress size={30} />
                        );
                    }

                    return(
                        <Button
                            color="inherit"
                            onClick={()=>signout()}
                        >
                            LogOut
                        </Button>
                    )
                }
            }
        </Mutation>
    );
}

export default SignOut;