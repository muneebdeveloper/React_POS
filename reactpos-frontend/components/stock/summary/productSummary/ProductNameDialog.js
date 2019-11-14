import React from 'react';
import {ApolloConsumer} from 'react-apollo';
import gql from 'graphql-tag';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';


const PRODUCT_NAME_UPDATE_MUTATION = gql`
    mutation PRODUCT_NAME_UPDATE_MUTATION($id:ID!,$name:String!){
        updateProduct(where:{id:$id},data:{name:$name}){
            id
            name
        }   
    }
`;

const inputChangeHandler = (setEditName,e)=>{
    setEditName(e.target.value);
}

const submitHandler = async (client,name,setLoading,id,dialogClose)=>{
    setLoading(true);
    let res = await client.mutate({
        mutation:PRODUCT_NAME_UPDATE_MUTATION,
        variables:{
            id,
            name
        }
    });
    
    setLoading(false);
    dialogClose();

}

const ProductNameDialog = (props)=>{

    const [editname,setEditName] = React.useState(props.name);
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
                        <>
                            <TextField
                                label="Product Name"
                                variant="outlined"
                                type="text"
                                name="editname"
                                value={editname}
                                onChange={inputChangeHandler.bind(this,setEditName)} 
                                fullWidth
                            />
                            <Button 
                                type="submit"
                                variant="contained"
                                size="large"
                                onClick={()=>submitHandler(client,editname,setLoading,props.id,props.dialogClose)}
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

};

export default ProductNameDialog;