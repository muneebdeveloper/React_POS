import React,{Component} from 'react';
import gql from 'graphql-tag';
import {ApolloConsumer} from 'react-apollo';
import debounce from 'lodash.debounce';

import MuiDownshift from 'mui-downshift';


const PRODUCTS_SEARCH_QUERY = gql`
    query PRODUCTS_SEARCH_QUERY($searchTerm:String!){
        products(where:{name_contains:$searchTerm}){
            barcode
            name
        }
    }
`;

class Search extends Component{

    state={
        searchResult:[],
        loading:false
    }

    stateChangeHandler = client =>async (e)=>{
        if(typeof e.inputValue==='string'){
            this.setState({loading:true})
            let res = await client.query({
                        query:PRODUCTS_SEARCH_QUERY,
                        variables:{
                            searchTerm:e.inputValue
                        }
                    });
            
                this.setState({
                    searchResult:res.data.products.map((el)=>({label:el.name,value:el.barcode})),
                    loading:false
                }); 
        }

    };

    submitHandler = (item)=>{
        this.props.searchHandler(item.value);
    }

    render(){
      let {searchResult,loading} = this.state;
        return(
                <ApolloConsumer>
                    {
                        (client)=>{
                            return(
                                <MuiDownshift
                                    onChange={this.submitHandler}
                                    items={searchResult}
                                    variant="outlined"
                                    getInputProps={()=>({label:"Search Product",autoFocus:true,onFocus:null})}
                                    onStateChange={this.stateChangeHandler(client)}
                                    loading={loading}
                                />
                            );
                        }
                    }
                </ApolloConsumer>
        );
    }

}

export default Search;