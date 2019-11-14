import React,{Component} from 'react';
import gql from 'graphql-tag';
import {Query,Subscription} from 'react-apollo';
import Router from 'next/router';

import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';

import styles from './Header.css';

const CHECK_EXPIRY = gql`
    query CHECK_EXPIRY{
        checkExpiry
    }
`;

const CHECK_QUANTITY = gql`
    query CHECK_QUANTITY{
        checkQuantity
    }
`

const EXPIRY_SUBSCRIPTION = gql`
    subscription EXPIRY_SUBSCRIPTION{
        expiry(where:{mutation_in:[CREATED,DELETED]}){
            mutation
        }
    }
`;

const QUANTITY_SUBSCRIPTION = gql`
    subscription QUANTITY_SUBSCRIPTION{
        quantity(where:{mutation_in:[CREATED,DELETED]}){
            mutation
        }
    }
`;



class Notifications extends Component{

    state={
        quantity:0
    }


    render(){
        return(
            <Query 
                query={CHECK_EXPIRY}
                onCompleted={(data)=>{
                    this.setState((state)=>({
                        quantity:state.quantity+data.checkExpiry
                    }));
                }}
            >
                {
                    ({loading:loading1})=>{
                        return(
                            <Query 
                                query={CHECK_QUANTITY}
                                onCompleted={(data)=>{
                                    this.setState((state)=>({
                                        quantity:state.quantity+data.checkQuantity
                                    }));
                                }}
                            >{
                                ({loading:loading2})=>{

                                    if(loading1 || loading2){
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
                                                   <Subscription
                                                    subscription={QUANTITY_SUBSCRIPTION}
                                                    onSubscriptionData={
                                                        (data)=>{
                    
                                                        if(data.subscriptionData.data.quantity.mutation=="CREATED"){
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
                                    </Subscription>
                                    )
                                }
                            }
                            </Query>
                        )
                       
                    }
                }
            </Query>
        )
       
    }
}

export default Notifications;