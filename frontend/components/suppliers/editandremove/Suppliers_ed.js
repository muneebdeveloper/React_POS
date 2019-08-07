import React, {Component} from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';

import Supplier_ed_table from './Supplier_ed_table';

import Intro from '../../misc/Intro';

const ALL_SUPPLIERS_LIST_QUERY = gql`
    query ALL_SUPPLIERS_LIST_QUERY{
        suppliers{
            id
            name
            phone
            address
        }
    }
`;

class Suppliers_ed extends Component{

    render(){
        return(
            <>
                <Intro>Edit / Remove Suppliers</Intro>
                <Query query={ALL_SUPPLIERS_LIST_QUERY}>
                {
                    ({data:{suppliers},error,loading})=>{

                        if(loading){
                            return <h1>Loading</h1>
                        }

                        if(error){
                            return <h1>Error</h1>
                        }

                        return(
                            <table>
                                <thead>
                                    <tr>
                                        <th>Sr#</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Address</th>
                                        <th style={{width:"81px"}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        suppliers.map((supplier,index)=>{
                                            const {id,name,phone,address} = supplier;
                                            return(
                                                <Supplier_ed_table 
                                                    key={id} 
                                                    id={id}
                                                    sr={index+1} 
                                                    name={name} 
                                                    phone={phone}
                                                    address={address}
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
            </>
        );
    }
}

export default Suppliers_ed;