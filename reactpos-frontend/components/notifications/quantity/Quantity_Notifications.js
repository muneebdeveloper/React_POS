import React,{Component} from 'react';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';

import CircularProgress from '@material-ui/core/CircularProgress';

import QuantityTable from './Quantity_Table';

const QUANTITIES_LIST_QUERY = gql`
    query QUANTITIES_LIST_QUERY{
        AllQuantitiesData{
            quantityID
            name
            description
        }
    }
`;


class Quantity_Notifications extends Component{

    render(){
        return(
            <Query
                query={QUANTITIES_LIST_QUERY}
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
                                    <th>Description</th>
                                    <th style={{minWidth:"81px"}}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.AllQuantitiesData.map((el,index)=>{
                                        const {quantityID,name,description} = el;
                                        return(
                                                <QuantityTable 
                                                    key={index}
                                                    sr={index+1}
                                                    name={name}
                                                    description={description} 
                                                    quantityID={quantityID}
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

export default Quantity_Notifications;
export {QUANTITIES_LIST_QUERY};