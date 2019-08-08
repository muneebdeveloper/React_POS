const {forwardTo} = require('prisma-binding');

const Query = {
    product:forwardTo('db'),
    supplier:forwardTo('db'),
    lineItems:forwardTo('db'),
    categories:forwardTo('db'),
    suppliers:forwardTo('db')
}

module.exports = Query;