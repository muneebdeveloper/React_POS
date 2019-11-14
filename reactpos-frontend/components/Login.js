import React,{Component} from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import ErrorDialog from './misc/ErrorDialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import {CURRENT_USER_QUERY} from '../components/CurrentUser';

import CurrentUser from '../components/CurrentUser';


const SIGNIN_MUTATION = gql`
    mutation SIGNIN_MUTATION($username:String!,$password:String!){
        signin(data:{username:$username,password:$password}){
            id
            username
            password
        }
    }
`;

class Login extends Component{

    constructor(props){
        super(props);
        this.inputFieldRef = React.createRef();
    }

    state={
        username:'admin',
        password:'admin',
        errorDialog:false,
        errorMessage:""
    }

    changeHandler = (e)=>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    signinSubmitHandler = (signin)=>async (e)=>{
        e.preventDefault();
        try{
            await signin();
        }catch(err){
            this.setState({
                errorDialog:true,
                errorMessage:"Username or password is incorrect",
                password:''
            });
        }
        
    }

    render(){
        const {
            username,
            password,
            errorDialog,
            errorMessage
        } = this.state;
        
        return(
            <>
            <div className="mainpage">

                <Mutation 
                    awaitRefetchQueries
                    mutation={SIGNIN_MUTATION}
                    variables={{
                        username,
                        password
                    }}
                    onCompleted={
                        ()=>{
                            if(Router.pathname==='/login'){
                                Router.push('/');
                            }
                        }
                    }
                    refetchQueries={[
                        {query:CURRENT_USER_QUERY}
                    ]}
                >
                    {
                        (signin,{loading:loading1})=>{

                            return(

                                <CurrentUser
                                    onCompleted={
                                        (data)=>{
                                            if(data.currentUser && Router.pathname==='/login'){
                                                Router.push('/');
                                            }
                                    }
                                }
                                >
                                    {
                                        ({data:{currentUser},loading:loading2})=>{
                                            if(loading1 || loading2){
                                                return(
                                                    <div className="mainLoadingStyle">
                                                        <CircularProgress size={70} />
                                                    </div>
                                                );
                                            }
                                            if(!currentUser){
                                                return(
                                                    <form method="post" onSubmit={this.signinSubmitHandler(signin)}>
                                                    <div className="mainFormStyle">
                                                        
                                                        <h1 style={{fontSize:"42px",textAlign:"center"}}>Login</h1>
                                                        <TextField 
                                                            label="username"
                                                            variant="outlined"
                                                            type="text"
                                                            name="username"
                                                            value={username}
                                                            onChange={this.changeHandler}
                                                            inputRef={this.inputFieldRef}
                                                            autoFocus
                                                            required
                                                        />
                
                                                        <TextField 
                                                            label="password"
                                                            variant="outlined"
                                                            name="password"
                                                            value={password}
                                                            onChange={this.changeHandler}
                                                            type="password"
                                                            required
                                                        />
                
                                                        <Button
                                                            type="submit"
                                                            variant="contained"
                                                            size="large"
                                                        >
                                                            Login
                                                        </Button>
                                                    </div>
                                                </form>
                                                )
                                            }
                                            return null;
                                        }
                                    }
                                </CurrentUser>
                            )
                        }
                    }
                </Mutation>

            </div>
            <ErrorDialog dialogValue={errorDialog} dialogClose={()=>this.setState({errorDialog:false})}>
                {
                    errorMessage
                }
            </ErrorDialog>
            </>
        )
    }
}

export default Login;