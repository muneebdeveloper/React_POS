import React from 'react';
import {ApolloConsumer} from 'react-apollo';

import {STOCKITEM_REMOVE_MUTATION} from '../../add/ProductAdd/index';

import Button from '@material-ui/core/Button';
import DialogActions  from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';

import styles from '../../../main.css';

const dialogSubmitHandler = async (client,id,dialogClose,setLoading)=>{
    setLoading(true);
    await client.mutate({
        mutation:STOCKITEM_REMOVE_MUTATION,
        variables:{
            id
        }
    });
    setLoading(false);
    dialogClose();
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
                                onClick={()=>dialogSubmitHandler(client,props.id,props.dialogClose,setLoading)}
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