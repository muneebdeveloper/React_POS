import React from 'react';
import gql from 'graphql-tag';
import {ApolloConsumer} from 'react-apollo';
import {FETCH_CATEGORIES_QUERY} from './CategorySummary';

import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

const CATEGORY_UPDATE_MUTATION = gql`
    mutation CATEGORY_UPDATE_MUTATION($name:String!,$id:ID!){
        updateCategory(data:{name:$name},where:{id:$id}){
            name
        }
    }
`;


const dialogSubmitHandler = async (client,id,name,setLoading,dialogClose)=>{

    setLoading(true);

    try{
        await client.mutate({
            mutation:CATEGORY_UPDATE_MUTATION,
            variables:{
                id,
                name
            },
            refetchQueries:[{query:FETCH_CATEGORIES_QUERY}]
        });
        setLoading(false);
        dialogClose();
    }catch(err){
        setLoading(false);
        dialogClose();
    }
    

}

const EditDialog = (props)=>{

    const [name,setName] = React.useState(props.name);
    const [loading,setLoading] = React.useState(false)

    return(
        <ApolloConsumer>
            {
                (client)=>{

                    if(loading){
                        return(
                            <CircularProgress size={45} />
                        )
                    }

                    return(
                            <>
                                <TextField 
                                    variant="outlined"
                                    label="Name"
                                    name="name"
                                    type="text"
                                    value={name}
                                    onChange={(e)=>setName(e.target.value)}
                                    fullWidth
                                    required 
                                />
                                <Button 
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={name?false:true}
                                    onClick={()=>dialogSubmitHandler(client,props.id,name,setLoading,props.dialogClose)}
                                    fullWidth
                                >
                                    Submit
                                </Button>
                            </>
                    )
                }
            }
        </ApolloConsumer>
    );
}

export default EditDialog;