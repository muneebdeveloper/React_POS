import React from 'react';
import gql from 'graphql-tag';
import {ApolloConsumer} from 'react-apollo';
import {QUANTITIES_LIST_QUERY} from './Quantity_Notifications';
import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';

import styles from '../../main.css';

const REMOVE_QUANTITY_MUTATION = gql`
    mutation REMOVE_QUANTITY_MUTATION($id:ID!){
        deleteQuantity(where:{id:$id}){
            id
        }
    }
`;

const removeQuantity = async (client,quantityID)=>{
    await client.mutate({
        mutation:REMOVE_QUANTITY_MUTATION,
        variables:{
            id:quantityID
        },
        refetchQueries:[{query:QUANTITIES_LIST_QUERY}],
        awaitRefetchQueries:true
    });
}

const Expiry_Table = (props)=>{
    const {sr,quantityID,name,description} = props;
    return(
        <tr>
            <td>{sr}</td>
            <td>{name}</td>
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
                                    onClick={()=>removeQuantity(client,quantityID)}
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