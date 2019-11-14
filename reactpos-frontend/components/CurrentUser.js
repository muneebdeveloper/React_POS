import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';

const CURRENT_USER_QUERY = gql`
    query CURRENT_USER_QUERY{
        currentUser{
            id
            username
        }
    }
`;

const CurrentUser = (props)=>(
        <Query {...props} query={CURRENT_USER_QUERY}>
            {
                payload=>props.children(payload)
            }
        </Query>
    )

export default CurrentUser;
export {CURRENT_USER_QUERY};


