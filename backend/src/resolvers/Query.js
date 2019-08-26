const {forwardTo} = require('prisma-binding');

const Query = {
    currentUser(parent,args,ctx,info){

        if(!ctx.request.userId){
            return null;
        }
        return ctx.db.query.user({
            where:{
                id:ctx.request.userId
            }
        },info);
    },
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