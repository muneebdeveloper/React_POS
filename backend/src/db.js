const {Prisma} = require('prisma-binding');
require('dotenv').config({path:'.env'});

const db = new Prisma({
    typeDefs:'src/generated/prisma.graphql',
    endpoint:process.env.PRISMA_BACKEND,
    debug:true
});

module.exports = db;