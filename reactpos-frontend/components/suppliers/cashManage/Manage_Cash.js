import React,{Component} from 'react';

import {Query} from 'react-apollo';
import Router from 'next/router';

import Intro from '../../misc/Intro';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

import {ALL_SUPPLIERS_LIST_QUERY} from '../editandremove/Suppliers_ed';
import Manage_Cash_Table from './Manage_Cash_Table';


class Manage_Cash extends Component{


    summaryClickHandler = (id)=>{
        Router.push(`/supplier_cash_manage_summary?id=${id}`);    
    }

    render(){
        return(
            <>
                <Intro>Supplier Cash Manage</Intro>
                <Query query={ALL_SUPPLIERS_LIST_QUERY} >
                    {
                        ({data:{suppliers},error,loading})=>{

                            if(loading){
                                return (
                                    <div style={{display:"flex",justifyContent:"center"}}>
                                    <CircularProgress size={70} />
                                </div>
                                    );
                            }

                            return(
                                <>
                                <h1 style={{textAlign:"center",color:"gray"}}>Select any supplier</h1>
                        <table>
                            <thead>
                                <tr  style={{backgroundColor:'black',color:'white'}}>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    suppliers.map((supplier,index)=>{
                                        const {id,name,phone,address} = supplier;
                                        return(
                                        <Manage_Cash_Table 
                                            key={index}
                                            rowClickHandler={this.summaryClickHandler}
                                            id={id}
                                            sr={index+1} 
                                            name={name} 
                                            phone={phone}
                                            address={address}
                                        />
                                        )
                                    }   
                                    )
                                }
                            </tbody>
                        </table>
                        </>
                            )
                        }
                        
                    }
                </Query>
            </>
        )
    }
}

export default Manage_Cash;