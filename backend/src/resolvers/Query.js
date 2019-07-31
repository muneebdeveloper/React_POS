const {forwardTo} = require('prisma-binding');

const Query = {
    lineItems:forwardTo('db')
}

module.exports = Query;