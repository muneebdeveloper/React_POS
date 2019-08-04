const {forwardTo} = require('prisma-binding');

const Query = {
    product:forwardTo('db'),
    lineItems:forwardTo('db'),
    categories:forwardTo('db')
}

module.exports = Query;