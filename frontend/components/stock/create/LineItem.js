import React,{Component} from 'react';

import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';

const CREATE_LINEITEM_QUERY = gql`
    mutation CREATE_LINEITEM_QUERY($name:String!){
        createLineItem(data:{name:$name}){
            name
        }
    }
`;

class LineItem extends Component{

    state={
        lineitem:'',
        error:''
    }

    changeHandler = (e)=>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    render(){
        const {lineitem,error} = this.state;
        return(
            <Mutation 
                mutation={CREATE_LINEITEM_QUERY} 
                variables={{"name":lineitem}} 
            >
                {   (createLineItem,{loading})=>
                    {
                        return(
                            <>
                            <form onSubmit={async e=>{
                                e.preventDefault();
                                if(lineitem){
                                    await createLineItem();
                                }else{
                                    this.setState({
                                        error:"empty"
                                    })
                                }
                                this.setState({
                                    lineitem:''
                                });
                            }}>
                                <label>Name:
                                <input type="text" name="lineitem" value={lineitem} onChange={this.changeHandler} autoFocus />
                                </label>
                                <button type="submit">Submit</button>
                            </form>
                            <h1>{error}</h1>
                            </>

                        );
                    }
                }
            </Mutation>
        );
    }
}


export default LineItem;