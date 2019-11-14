import { HttpLink } from 'apollo-link-http';
import { ApolloLink, Observable, split } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { withClientState } from 'apollo-link-state';
import withApollo from 'next-with-apollo';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
// import ApolloClient from 'apollo-boost';

import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import { endpoint, prodEndpoint, wsEndpoint } from '../config';


function createClient({ headers }) {
  

  // const networkLink = new HttpLink({
  const httpLink = new HttpLink({
    uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,
    credentials: 'include',
  });

  // Create a WebSocket link:
  const wsLink = process.browser ? new WebSocketLink({
    uri: wsEndpoint,
    options: {
      reconnect: true,
    },
  }) : () => console.log('SSR');
  // using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  const networkLink = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink,
  );

  const myCache = new InMemoryCache({ IntrospectionFragmentMatcher });
  

  const request = async (operation) => {
    operation.setContext({
      fetchOptions: {
        credentials: 'include',
      },
      headers,
    });
  };

  const requestLink = new ApolloLink((operation, forward) =>
    new Observable(observer => {
      let handle;
      Promise.resolve(operation)
        .then(oper => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
  );

  return new ApolloClient({
    name: 'web',
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          // sendToLoggingService(graphQLErrors);
          console.log('here is some error',graphQLErrors);
        }
        if (networkError) {
          console.log('there is a network error',networkError);
          // logoutUser();
        }
      }),
      requestLink,
      networkLink,
    ]),
    cache: myCache,
    defaultOptions: {
      watchQuery: {
         fetchPolicy: 'network-only',
         errorPolicy: 'ignore',
      },
      query: {
         fetchPolicy: 'network-only',
         errorPolicy: 'all',
      },
    },
    // ssrMode: true,
  });
}


export default withApollo(createClient,{ getDataFromTree: 'ssr' });