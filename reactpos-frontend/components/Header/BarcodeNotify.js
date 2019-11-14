import React,{Component} from 'react';
import gql from 'graphql-tag';
import {Query,Subscription} from 'react-apollo';
import Router from 'next/router';

import Badge from '@material-ui/core/Badge';
import BarcodeIcon from '@material-ui/icons/ViewWeek';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';


const BARCODES_COUNT_QUERY = gql`
    query BARCODES_COUNT_QUERY{
        barcodesConnection{
            aggregate{
                count
            }
        }
    }
`;

const BARCODE_SUBSCRIPTION = gql`
    subscription BARCODE_SUBSCRIPTION{
        barcode(where:{mutation_in:[CREATED,DELETED]}){
            mutation
        }
    }
`;



class BarcodeNotify extends Component{

    state={
        quantity:0
    }


    render(){
        return(
            <Query 
                query={BARCODES_COUNT_QUERY}
                onCompleted={(data)=>{
                    this.setState({
                        quantity:data.barcodesConnection.aggregate.count
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
                                subscription={BARCODE_SUBSCRIPTION}
                                onSubscriptionData={
                                    (data)=>{

                                       if(data.subscriptionData.data.barcode.mutation=="CREATED"){
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
                                            onClick={()=>Router.push('/barcodes')}
                                        >
                                            <Badge badgeContent={this.state.quantity} color="primary">
                                                <BarcodeIcon />
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

export default BarcodeNotify;