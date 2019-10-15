import React from 'react';
import gql from 'graphql-tag';
import {ApolloConsumer} from 'react-apollo';
import {BARCODES_LIST_QUERY} from './Generated';
import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';

import styles from '../main.css';

const REMOVE_BARCODE_MUTATION = gql`
    mutation REMOVE_BARCODE_MUTATION($id:ID!){
        deleteBarcode(where:{id:$id}){
            id
        }
    }
`;

const removeGeneratedBarcode = async (client,barcodeID)=>{
    await client.mutate({
        mutation:REMOVE_BARCODE_MUTATION,
        variables:{
            id:barcodeID
        },
        refetchQueries:[{query:BARCODES_LIST_QUERY}],
        awaitRefetchQueries:true
    });
}

const Generated_Table = (props)=>{
    const {sr,barcodeID,name,barcode,sellPrice,wholesalePrice} = props;
    return(
        <tr>
            <td>{sr}</td>
            <td>{name}</td>
            <td>{barcode}</td>
            <td>{sellPrice}</td>
            <td>{wholesalePrice}</td>
            <td style={{textAlign:"center"}}>
                <ApolloConsumer>
                    {
                        (client)=>{
                            // if(loading){
                            //     return(
                            //         <CircularProgress size={30} />
                            //     )
                            // }
                            return(
                                <IconButton 
                                    size="small" 
                                    onClick={()=>removeGeneratedBarcode(client,barcodeID)}
                                >
                                    <DeleteIcon className={styles.delete} />
                                </IconButton> 
                            )
                        }
                    }
                </ApolloConsumer>                           
            </td>
        </tr>
    );
}

export default Generated_Table;