import React,{Component} from 'react';

import {Query,Mutation} from 'react-apollo';
import gql from 'graphql-tag';

const CREATE_CATEGORY_QUERY = gql`
    mutation CREATE_CATEGORY_QUERY($name:String!,$id:ID!){
        createCategory(data:{name:$name,lineitem:{connect:{id:$id}}}){
            name
        }
    }
`;

const FETCH_LINEITEMS_QUERY = gql`
    query FETCH_LINEITEMS_QUERY{
        lineItems{
            id
            name
        }
    }
`;

class Category extends Component{

    state={
        category:'',
        errorForm:'',
        lineitemid:'',
        linearray:[]
    }

    changeHandler = (e)=>{
        this.setState({
            [e.target.name]:e.target.value,
            errorForm:''
        });
    }

    render(){
        const {category,errorForm,lineitemid} = this.state;
        
        return(
            <Query query={FETCH_LINEITEMS_QUERY} >
                {   
                    ({data,error,loading})=>{

                        

                            if(loading){
                                return <h1>Loading</h1>
                            }
                        
                    return( 
                    <Mutation mutation={CREATE_CATEGORY_QUERY} variables={{"name":category,"id":lineitemid}}>
                    {   (createCategory,{loading})=>
                        {
                            
                            if(loading){
                                return <h2>Loading</h2>;
                            }

                            return(
                                <>
                                <form onSubmit={async e=>{
                                    e.preventDefault();
                                   
                                    if(category && (lineitemid!=='select' && lineitemid!=='')){
                                        await createCategory();
                                    }else{
                                        this.setState({
                                            errorForm:"empty"
                                        })
                                    }
                                    this.setState({
                                        lineitemid:'',
                                        category:''
                                    });
                                }}>
                                    <label>Name:
                                    <input type="text" name="category" value={category} onChange={this.changeHandler} autoFocus />
                                    </label>
                                    <select name="lineitemid" onChange={this.changeHandler}>
                                        <option value="select">Select</option>
                                        {  
                                         data &&  data.lineItems.map((lineitem)=>{
                                                return(
                                                    <option key={lineitem.id} value={lineitem.id}>{lineitem.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    <button type="submit">Submit</button>
                                </form>
                                <h1>{errorForm}</h1>
                                </>
                            );
                        }
                    }
                </Mutation>
                );
                        
                }   
                }     
            </Query>
        );
    }
}


export default Category;
export {FETCH_LINEITEMS_QUERY};