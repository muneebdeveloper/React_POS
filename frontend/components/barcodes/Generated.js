import React,{Component} from 'react';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';

import CircularProgress from '@material-ui/core/CircularProgress';

import Generated_Table from './Generated_Table';

const BARCODES_LIST_QUERY = gql`
    query BARCODES_LIST_QUERY{
        AllBarcodesData{
            barcodeID
            name
            barcode
            sellPrice
            wholesalePrice
        }
    }
`;


class Generated extends Component{

    render(){
        return(
            <Query
                query={BARCODES_LIST_QUERY}
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
                                    <th>Sell Price</th>
                                    <th>Wholesale Price</th>
                                    <th style={{minWidth:"81px"}}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.AllBarcodesData.map((el,index)=>{
                                        const {barcodeID,name,barcode,sellPrice,wholesalePrice} = el;
                                        return(
                                                <Generated_Table 
                                                    key={index}
                                                    sr={index+1}
                                                    name={name}
                                                    barcode={barcode}
                                                    sellPrice={sellPrice}
                                                    wholesalePrice={wholesalePrice}
                                                    barcodeID={barcodeID}
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

export default Generated;
export {BARCODES_LIST_QUERY};