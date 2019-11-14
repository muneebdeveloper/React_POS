import React from 'react';
import gql from 'graphql-tag';
import {ApolloConsumer} from 'react-apollo';
import {EXPIRIES_LIST_QUERY} from './Expiry_Notifications';
import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';

import styles from '../../main.css';

const REMOVE_EXPIRY_MUTATION = gql`
    mutation REMOVE_EXPIRY_MUTATION($id:ID!){
        deleteExpiry(where:{id:$id}){
            id
        }
    }
`;

const removeExpiry = async (client,expiryID)=>{
    await client.mutate({
        mutation:REMOVE_EXPIRY_MUTATION,
        variables:{
            id:expiryID
        },
        refetchQueries:[{query:EXPIRIES_LIST_QUERY}],
        awaitRefetchQueries:true
    });
}

const Expiry_Table = (props)=>{
    const {sr,expiryID,name,barcode,description} = props;
    return(
        <tr>
            <td>{sr}</td>
            <td>{name}</td>
            <td>{barcode}</td>
            <td>{description}</td>
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
                                    onClick={()=>removeExpiry(client,expiryID)}
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

export default Expiry_Table;