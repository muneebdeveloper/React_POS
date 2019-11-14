import React ,{Component} from 'react';

import ErrorDialog from '../misc/ErrorDialog';
import SnackBar from '../misc/SnackBar';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

class Settings extends Component{

    state={
        settings:''
    }

    changeHandler = (e)=>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    

    render(){

        const {
            settings,
        } = this.state;

        const { 
            loading,
            snackBar,
            errorDialog,
            errorMessage,     
            snackBarMessage,
            submitHandler,
            errorDialogClose,
            snackBarClose
            } = this.props;
 

            if(loading){
                return(
                    <div className="mainLoadingStyle">
                        <CircularProgress size={70} />
                    </div>
                    )
            }

                        return(
                            <>
                            <form onSubmit={(e)=>{
                                e.preventDefault();
                                submitHandler(this.state.settings)
                            }}>
                                <div className="mainFormStyle">

                                    <TextField 
                                        label="Number of Days"
                                        variant="outlined"
                                        name="settings"
                                        type="text"
                                        value={settings}
                                        required
                                        autoFocus
                                        onChange={this.changeHandler}
                                    />


                                    <Button 
                                        variant="contained"
                                        type="submit"
                                        size="large"
                                    >
                                        Submit
                                    </Button>

                                </div>
                            </form>
                        

            <ErrorDialog dialogValue={errorDialog} dialogClose={()=>errorDialogClose()}>
                {errorMessage}
            </ErrorDialog>

            <SnackBar snackbarValue={snackBar} snackbarClose={()=>snackBarClose()}>
                {snackBarMessage}
            </SnackBar>
            </>
            );
        
    }
}

export default Settings;
