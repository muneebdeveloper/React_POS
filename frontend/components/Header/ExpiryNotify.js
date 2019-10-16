import React,{Component} from 'react';
import gql from 'graphql-tag';
import {Query,Subscription} from 'react-apollo';
import Router from 'next/router';

import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';

import styles from './Header.css';

const EXPIRY_COUNT_QUERY = gql`
    query EXPIRY_COUNT_QUERY{
        expiriesConnection{
            aggregate{
                count
            }
        }
    }
`;

const EXPIRY_SUBSCRIPTION = gql`
    subscription EXPIRY_SUBSCRIPTION{
        expiry(where:{mutation_in:[CREATED,DELETED]}){
            mutation
        }
    }
`;



class ExpiryNotify extends Component{

    state={
        quantity:0
    }


    render(){
        return(
            <Query 
                query={EXPIRY_COUNT_QUERY}
                onCompleted={(data)=>{
                    this.setState({
                        quantity:data.expiriesConnection.aggregate.count
                    });
                }}
            >
                {
                    ({loading})=>{

                        if(loading){
                            return(
                                <CircularProgress size={30} />
                            )
                        }

                        return(
                            <Subscription 
                                subscription={EXPIRY_SUBSCRIPTION}
                                onSubscriptionData={
                                    (data)=>{

                                       if(data.subscriptionData.data.expiry.mutation=="CREATED"){
                                            this.setState((state)=>{
                                                
                                                return{ 
                                                    quantity:state.quantity + 1
                                                }
                                            })
                                       }else{
                                            this.setState((state)=>{
                                                    
                                                return{ 
                                                    quantity:state.quantity - 1
                                                }
                                            })
                                       }
                                        
                                    }
                                }
                            >
                                {
                                   (payload)=>{
                                       
                                       return(

                                        <IconButton  
                                            color="inherit" 
                                            aria-label="menu" 
                                            className={styles.marginRightButton}
                                            onClick={()=>Router.push('/notifications')}
                                        >
                                        <Badge badgeContent={this.state.quantity} color="primary">
                                          <NotificationsIcon />
                                        </Badge>
                                        </IconButton>
                                    )
                                   }
                                }
                            </Subscription>
                        )
                    }
                }
            </Query>
        )
       
    }
}

export default ExpiryNotify;