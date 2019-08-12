const {forwardTo} = require('prisma-binding');


const Mutation = {
    createLineItem:forwardTo('db'),
    createCategory:forwardTo('db'),
    createProduct:forwardTo('db'),
    createStockItem:forwardTo('db'),
    createSupplier:forwardTo('db'),
    updateSupplier:forwardTo('db'),
    deleteSupplier:forwardTo('db'),
    createPaidDetail:forwardTo('db'),
    createExpense:forwardTo('db')
}

module.exports = Mutation;