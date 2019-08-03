const {forwardTo} = require('prisma-binding');

const Query = {
    lineItems:forwardTo('db'),
    categories:forwardTo('db')
}

module.exports = Query;