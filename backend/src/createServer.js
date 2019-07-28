const {GraphQLServer} = require('graphql-yoga');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');


const createServer = ()=>{
    return new GraphQLServer({
        typeDefs:'src/schema.graphql',
        resolvers:{
            Query,
            Mutation
        },
        resolverValidationOptions:{
            requireResolversForResolveType:false
        },
        context:req=>({...req})
    });
}

module.exports = createServer;