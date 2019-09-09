const {GraphQLServer} = require('graphql-yoga');
const db = require('./db');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Subscription = require('./resolvers/Subscription');


const createServer = ()=>{
    return new GraphQLServer({
        typeDefs:'src/schema.graphql',
        resolvers:{
            Query,
            Mutation,
            Subscription
        },
        resolverValidationOptions:{
            requireResolversForResolveType:false
        },
        context:req=>({...req,db})
    });
}

module.exports = createServer;