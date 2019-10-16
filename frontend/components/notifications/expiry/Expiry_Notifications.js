import React,{Component} from 'react';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';

import CircularProgress from '@material-ui/core/CircularProgress';

import ExpiryTable from './Expiry_Table';

const EXPIRIES_LIST_QUERY = gql`
    query EXPIRIES_LIST_QUERY{
        AllExpiriesData{
            expiryID
            name
            barcode
            description
        }
    }
`;


class Expiry_Notifications extends Component{

    render(){
        return(
            <Query
                query={EXPIRIES_LIST_QUERY}
            >
                {
                    ({data,loading})=>{

                        if(loading){
                            return(
                                <div className="mainLoadingStyle">
                                    <CircularProgress size={70} />
                                </div>
                            );
                        }

                        return(
                            <table>
                            <thead>
                                <tr>
                                    <th>Sr#</th>
                                    <th>Name</th>
                                    <th>Barcode</th>
                                    <th>Description</th>
                                    <th style={{minWidth:"81px"}}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.AllExpiriesData.map((el,index)=>{
                                        const {expiryID,name,barcode,description} = el;
                                        return(
                                                <ExpiryTable 
                                                    key={index}
                                                    sr={index+1}
                                                    name={name}
                                                    barcode={barcode}
                                                    description={description} 
                                                    expiryID={expiryID}
                                                />      
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                        )
                    }
                }
            </Query>
        )
  
    }
    
}

export default Expiry_Notifications;
export {EXPIRIES_LIST_QUERY};