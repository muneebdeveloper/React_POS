import React, {Component} from 'react';

import gql from 'graphql-tag';
import {Query, Mutation,ApolloConsumer} from 'react-apollo';
import {FETCH_LINEITEMS_QUERY} from './Category';


const CATEGORY_ITEMS_QUERY = gql`
    query CATEGORY_ITEMS_QUERY($id:ID!){
        categories(where:{lineitem:{id:$id}}){
                id
                name
            }
    }
`;


 const PRODUCT_CREATE_MUTATION = gql`
    mutation PRODUCT_CREATE_MUTATION($barcode:String!,$name:String!,$id:ID!){
        createProduct(data:{barcode:$barcode,name:$name,category:{connect:{id:$id}}}){
            id
        }
    }
 `


class Product extends Component{

    state={
        name:'',
        barcode:'',
        lineitemID:'',
        loadingID:false,
        categoryList:[],
        categoryID:'',
        errorID:''
    }

    lineitemSelectChangeHandler = client =>async e=>{
        
        const lineitemID = e.target.value;
        this.setState({
            lineitemID,
            loadingID:true
        })

        try{
            
            const res = await client.query({
                query:CATEGORY_ITEMS_QUERY,
                variables:{
                    id:lineitemID
                }
            });
            const {data:{categories}} = res;
            this.setState({
                categoryList : [...categories],
                loadingID:false
            });
        }catch(err){
            this.setState({
                errorID:"Error"
            });
        }
    }

   ChangeHandler = e =>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    formSubmitHandler=createProduct=>async e=>{
        e.preventDefault();
        await createProduct();
        this.setState({
            name:'',
            barode:'',
            lineitemID:'',
            loadingID:false,
            categoryList:[],
            categoryID:'',
            errorID:''
        });
    }

    render(){
        const {lineitemID,loadingID,errorID,categoryList,categoryID,barcode,name} = this.state;
        return(
            <Query query={FETCH_LINEITEMS_QUERY}>
                {({data,error,loading})=>{

                    if(error){
                        return <h1>Error</h1>;
                    }

                    if(loading){
                        return <h1>loading</h1>;
                    }

                    return(
                    <ApolloConsumer>
                        {(client)=>{
                            return(<Mutation mutation={PRODUCT_CREATE_MUTATION} variables={{name,barcode,id:categoryID}}>
                                {
                                    (createProduct,{loading,error})=>{
                                        if(loading){
                                            return(<h2>Loading</h2>);
                                        }
                                        if(error){
                                            return(<h2>error</h2>);
                                        }
                                        return(
                                            <form onSubmit={this.formSubmitHandler(createProduct)}>  
                                                <label>Name
                                                <input name="name" type="text" value={name} required onChange={this.ChangeHandler}/>
                                                </label>
                    
                                                <label>Barcode
                                                <input name="barcode" type="text" value={barcode} required onChange={this.ChangeHandler}/>
                                                </label>
                    
                                                <select name="lineitemID" name2="loadingID" onChange={this.lineitemSelectChangeHandler(client)} >
                                                    <option value="select">Select a lineitem</option>
                                                    {
                                                        data.lineItems.map((lineitem)=>{
                                                            return(
                                                                <option value={lineitem.id} key={lineitem.id}>{lineitem.name}</option>
                                                            );
                                                        })
                                                    }
                                                </select>
                    
                                                {loadingID?(<h2>loading</h2>):
                                                <select name="categoryID" disabled={lineitemID ? false :true} onChange={this.ChangeHandler}>
                                                    <option value="select">Select a Category</option>
                                                    {
                                                        categoryList.map((category)=>{
                                                            return(
                                                            <option value={category.id} key={category.id}>{category.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            }
                    
                                            {errorID && <h1>errorID</h1>}
                                                
                                            <button type="submit" disabled={categoryID?false:true}>Submit</button>
                                            </form>
                                                );       
                                    }
                                }
                        </Mutation>);
                        }
                        }
                    </ApolloConsumer>
                    )
                }
                }
            </Query>
        );
    }
}

export default Product;