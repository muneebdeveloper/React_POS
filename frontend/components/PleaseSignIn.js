import React from 'react';
import {Query} from 'react-apollo';

import Login from './Login';

import {CURRENT_USER_QUERY} from './CurrentUser';

import CircularProgress from '@material-ui/core/CircularProgress';


const PleaseSignIn = (props)=>{
    return(
        <Query
            query={CURRENT_USER_QUERY}
        >
            {
                ({data,loading})=>{
                    if(loading){
                        return(
                            <div className="mainpage">
                                <div className="mainLoadingStyle">
                                    <CircularProgress size={70} />
                                </div>
                            </div>
                        )
                    }
                    if(!data.currentUser){
                        return(
                            <Login />
                        )
                    }
                    return(
                        props.children
                    )
                }
            }
        </Query>
    )
}

export default PleaseSignIn;