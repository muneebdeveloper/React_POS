const {forwardTo} = require('prisma-binding');

const Subscription = {
    barcode:{
        subscribe(parent,args,ctx,info){
            return ctx.db.subscription.barcode({where:{...args.where}},info);
        }
    }
}

module.exports = Subscription;