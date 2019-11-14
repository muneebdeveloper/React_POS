import React,{Component} from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';

import Intro from '../../misc/Intro';
import ErrorDialog from '../../misc/ErrorDialog';
import SnackBar from '../../misc/SnackBar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';


const CREATE_LINEITEM_QUERY = gql`
    mutation CREATE_LINEITEM_QUERY($name:String!){
        createLineItem(data:{name:$name}){
            name
        }
    }
`;

class LineItem extends Component{

    constructor(props){
        super(props);

        this.inputFieldRef = React.createRef();
    }

    state={
        lineitem:'',
        snackbarOpen:false,
        errorMessage:'',
        errorDialogOpen:false,
        inputautoFocus:false
    }

    changeHandler = (e)=>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    componentDidMount(){
        
        this.inputFieldRef.current.focus();
        this.setState({
            inputautoFocus:true
        })
    }

   

    submitHandler = (createLineItem)=>async (e)=>{
        e.preventDefault();
        await createLineItem();
        this.setState({
            lineitem:''
        })
    }



    render(){
        const {lineitem,snackbarOpen,errorMessage,errorDialogOpen,inputautoFocus} = this.state;
        return(
            <>
            <Intro>Define a Line Item</Intro>
            <Mutation 
                mutation={CREATE_LINEITEM_QUERY} 
                variables={{name:lineitem}}
                onCompleted={()=>{
                   this.setState({
                       snackbarOpen:true
                   });
                }
                }
                onError={(error)=>{
                    
                    if(error.message.toLowerCase().includes("unique")){
                        this.setState({
                            errorMessage:'The lineitem you are trying to create is already added',
                            errorDialogOpen:true
                        })
                    }
                }
                }
            >
                {   (createLineItem,{loading,error})=>
                    {
                        
                        if(loading){
                            return(
                                <div className="mainLoadingStyle">
                                    <CircularProgress size={70} />
                                </div>
                            )
                        }

                        if(errorDialogOpen){
                           
                            return(
                                <ErrorDialog dialogValue={errorDialogOpen} dialogClose={()=>this.setState({errorDialogOpen:false})}>
                                    {errorMessage}
                                </ErrorDialog>
                            )
                        }

                        return(
                            <>
                            <form onSubmit={this.submitHandler(createLineItem)}>
                                <div className="mainFormStyle">

                                    <TextField 
                                        label="Name"
                                        variant="outlined"
                                        name="lineitem"
                                        type="text"
                                        value={lineitem}
                                        required
                                        autoFocus={inputautoFocus}
                                        inputRef={this.inputFieldRef}
                                        onChange={this.changeHandler}
                                    />

                                    
                                        <Button 
                                            variant="contained"
                                            type="submit"
                                            size="large"
                                        >
                                            Create
                                        </Button>
                                    
                                </div>
                            </form>
                            <SnackBar snackbarValue={snackbarOpen} snackbarClose={()=>this.setState({snackbarOpen:false})}>
                                The lineitem has been successfully created
                            </SnackBar>
                            </>
                        );
                    }
                }
            </Mutation>
            </>
        );
    }
}


export default LineItem;