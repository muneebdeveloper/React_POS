const {forwardTo} = require('prisma-binding');


const Mutation = {
    createLineItem:forwardTo('db'),
    createCategory:forwardTo('db'),
    createProduct:forwardTo('db'),
    createStockItem:forwardTo('db'),
    createSupplier:forwardTo('db')
}

module.exports = Mutation;