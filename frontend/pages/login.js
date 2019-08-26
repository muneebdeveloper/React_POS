import React,{Component} from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

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

    componentDidMount(){
        if(this.inputFieldRef.current){
            this.inputFieldRef.current.focus();
        }
    }

    state={
        username:'',
        password:''
    }

    changeHandler = (e)=>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    signinSubmitHandler = (signin)=>async (e)=>{
        e.preventDefault();
        await signin();
    }

    render(){
        const {
            username,
            password
        } = this.state;
        
        return(
            <div className="mainpage">

                <Mutation 
                    mutation={SIGNIN_MUTATION}
                    variables={{
                        username,
                        password
                    }}
                    onCompleted={
                        ()=>{
                            Router.push('/');
                        }
                    }
                >
                    {
                        (signin,{loading})=>{
                            if(loading){
                                return(
                                    <div className="mainLoadingStyle">
                                        <CircularProgress size={70} />
                                    </div>
                                )
                            }

                            return(

                                <CurrentUser
                                    onCompleted={
                                        (data)=>{
                                            if(data.currentUser){
                                                Router.push('/');
                                            }
                                        }
                                    }
                                >
                                    {
                                        ({data:{currentUser},loading})=>{
                                            if(loading){
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
                                                        <img src="static/logo.png" style={{width:"25% !important"}} />
                                                        <h1 style={{fontSize:"42px",textAlign:"center"}}>Login</h1>
                                                        <TextField 
                                                            label="username"
                                                            variant="outlined"
                                                            type="text"
                                                            name="username"
                                                            value={username}
                                                            onChange={this.changeHandler}
                                                            inputRef={this.inputFieldRef}
                                                        />
                
                                                        <TextField 
                                                            label="password"
                                                            variant="outlined"
                                                            name="password"
                                                            value={password}
                                                            onChange={this.changeHandler}
                                                            type="password"
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
        )
    }
}

export default Login;