import React from 'react';
import gql  from 'graphql-tag';
import {ApolloConsumer} from 'react-apollo';
import {FETCH_LINEITEMS_QUERY} from '../../define/Category';

import Button from '@material-ui/core/Button';
import DialogActions  from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';



const LINEITEM_REMOVE_MUTATION = gql`
    mutation LINEITEM_REMOVE_MUTATION($id:ID!){
        deleteLineItem(where:{id:$id}){
            id
        }
    }
`;

const dialogSubmitHandler = async(client,id,dialogClose,dialogError,setLoading)=>{
    setLoading(true);
    try{
        await client.mutate({
            mutation:LINEITEM_REMOVE_MUTATION,
            variables:{
                id
            },
            refetchQueries:[
                {query:FETCH_LINEITEMS_QUERY}
            ]
        });
        setLoading(false);
        dialogClose();
    }catch(err){
        setLoading(false);
        dialogClose();
        dialogError("LineItem can not be removed")
    }

}

const RemoveDialog = (props)=>{
    const [loading,setLoading] = React.useState(false);
    return(

        <ApolloConsumer>
            {
                (client)=>{
                    if(loading){
                        return(
                            <div className="dialogLoadingStyle">
                                <CircularProgress size={70} />
                            </div>
                            )
                    }
    
                    return(
                        <DialogActions>
        
                          
                            <Button 
                                variant="contained"
                                size="large"
                                onClick={()=>dialogSubmitHandler(client,props.id,props.dialogClose,props.dialogError,setLoading)}
                            >
                                yes
                            </Button>
                            
                        </DialogActions>
                    
                    );
                }
            }
        </ApolloConsumer>

    );
}

export default RemoveDialog;