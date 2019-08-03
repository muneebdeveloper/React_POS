import React,{Component} from 'react';
import Details from '../components/Details';
import styles from './index.css';
import {ApolloConsumer} from 'react-apollo';
import gql from 'graphql-tag';

const USER_QUERY = gql`
    query USER_QUERY($id:ID!){
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
        receipt:[],
        loading:false
    }

    inputHandler=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    receiptHandler=async (e,client)=>{
        
        this.setState({
            loading:true
        })
       try{
            const res = await client.query({
            query:USER_QUERY,
            variables:{id:this.state.id}
            });
            const {data:{user}} = res;
            const receiptor = [...this.state.receipt,user];
            this.setState({
                receipt:receiptor,
                id:'',
                loading:false
            });
    }
    catch(err){
            this.setState({
                error:true,
                loading:false
            })
    }

       
    }
    

    render(){
        const {id,loading,error,receipt}=this.state;
        return(
            <ApolloConsumer>
            {
                (client)=>{

                    if(loading){
                        return <h2>Loading</h2>
                    }

                    if(error){
                        return <h2>Error</h2>
                    }
                   
                    return(
                    <>
                        <section className="mainshop">
                            <div className={styles.toolbar}>
                                <form onSubmit={  e=>{
                                    e.preventDefault();
                                    return this.receiptHandler(e,client);
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
                            { receipt.length>0 &&
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
            </ApolloConsumer>
        );
    }
}

export default Home;