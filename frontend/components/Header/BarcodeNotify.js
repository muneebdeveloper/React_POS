import React,{Component} from 'react';
import gql from 'graphql-tag';
import {Subscription} from 'react-apollo';

import Badge from '@material-ui/core/Badge';
import BarcodeIcon from '@material-ui/icons/ViewWeek';
import IconButton from '@material-ui/core/IconButton';

const BARCODE_SUBSCRIPTION = gql`
    subscription BARCODE_SUBSCRIPTION{
        barcode(where:{mutation_in:CREATED}){
            node{
                code
            }
        }
    }
`;


class BarcodeNotify extends Component{
    state={
        quantity:0
    }

    render(){
        return(
            <Subscription 
                subscription={BARCODE_SUBSCRIPTION}
                onSubscriptionData={
                    (data)=>{
                        this.setState((state)=>{
                            
                           return{ 
                               quantity:state.quantity + 1
                            }
                        })
                    }
                }
            >
                {
                   (payload)=>{
                       
                       return(
                        <IconButton color="inherit">
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

export default BarcodeNotify;