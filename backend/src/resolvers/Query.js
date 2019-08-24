const {forwardTo} = require('prisma-binding');

const Query = {
    product:forwardTo('db'),
    stockItem:forwardTo('db'),
    supplier:forwardTo('db'),
    lineItems:forwardTo('db'),
    categories:forwardTo('db'),
    products:forwardTo('db'),
    suppliers:forwardTo('db'),
    paidDetails:forwardTo('db'),
    salesItems:forwardTo('db'),
    expense:forwardTo('db'),
    expenses:forwardTo('db')
}

module.exports = Query;