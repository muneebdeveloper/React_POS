import React,{Component} from 'react';
import Details from '../components/Details';
import styles from './index.css';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';

const USER_QUERY = gql`
    mutation USER_QUERY($id:ID!){
        user(id:$id){
            username
            first_name
            last_name
            gender
            password
            status
        }

    }
`;



class Home extends Component{

    state={
        id:'',
        firsttime:true,
        receipt:[]
    }

    inputHandler=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    render(){
        const {id,receipt}=this.state;
        return(
            <Mutation mutation={USER_QUERY} variables={this.state}>
            {
                (user,{data,error,loading})=>{

                    if(error){
                        return(
                            <h1>Wrong id</h1>
                        );
                    }

                    if(loading){
                        return(
                            <h1>Loading</h1>
                        );
                    }

                    if(data && this.state.firsttime){
                        
                        console.log(data);
                        const receiptor = [...this.state.receipt,data.user];
                        this.setState({
                            id:'',
                            firsttime:false,
                            receipt:receiptor
                        })
                    }

                    return(
                    <>
                        <section className="mainshop">
                            <div className={styles.toolbar}>
                                <form onSubmit={ e=>{
                                    e.preventDefault();
                                    return user();
                                }}>
                                    <label>
                                        Product Code : 
                                        <input type="text" name="id" value={id} onChange={this.inputHandler} autoFocus />
                                    </label>
                                    <button type="submit" >
                                        Submit
                                    </button>
                                    
                                </form>
                            </div>

                        </section>

                        <section className={styles.maininfo}>
                            { data &&
                                receipt.map((users,index)=>{
                                    return(
                                    <Details {...users} key={index} serial={index} />
                                    );
                                })
                            }
                        </section>
                    </>);
                }

            }
            </Mutation>
        );
    }
}

export default Home;