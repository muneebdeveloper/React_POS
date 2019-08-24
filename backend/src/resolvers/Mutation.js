const {forwardTo} = require('prisma-binding');


const Mutation = {
    createLineItem:forwardTo('db'),
    createCategory:forwardTo('db'),
    createProduct:forwardTo('db'),
    updateStockItem:forwardTo('db'),
    createSupplier:forwardTo('db'),
    updateSupplier:forwardTo('db'),
    deleteSupplier:forwardTo('db'),
    createPaidDetail:forwardTo('db'),
    createExpense:forwardTo('db'),
    updateExpense:forwardTo('db'),
    deleteExpense:forwardTo('db'),

    createStockItem(parent,args,ctx,info){

        const {data:{sellPrice,product:{connect:{id}}}} = args;
        ctx.db.mutation.updateProduct({data:{sellPrice},where:{id}});

        return ctx.db.mutation.createStockItem({data:args.data},info);
    },
    async deleteStockItem(parent,args,ctx,info){

        const user = await ctx.db.query.stockItem({where:{id:args.where.id}},`{product{id stock{sellPrice}}}`);
        
        if(user.product.stock.length){
            ctx.db.mutation.updateProduct({data:{sellPrice:user.product.stock.pop().sellPrice},where:{id:user.product.id}});
        }else{
            ctx.db.mutation.updateProduct({data:{sellPrice:null},where:{id:user.product.id}});
        }
        return ctx.db.mutation.deleteStockItem({where:{id:args.where.id}},info);

    },
    async createSalesTicket(parent,args,ctx,info){
        
        const receipt = Math.floor((Math.random() * 9000000000000) + 1000000000000);
        let run = true;
        while(run){
            let ticket = await ctx.db.query.salesTicket({where:{receipt:String(receipt)}},`{receipt}`);
            if(!ticket){
                run=false
            }else{
                receipt = Math.floor((Math.random() * 9000000000000) + 1000000000000);
            }
        }
        return ctx.db.mutation.createSalesTicket({data:{receipt:String(receipt)}},info);
    },
    async createSalesItem(parent,args,ctx,info){

        const {data:{sellPrice,noofpieces,product:{connect:{id}}}} = args;
        const product = await ctx.db.query.product({where:{id}},`{stock{buyPrice supplier{id name} }}`);
        const requiredData = product.stock.shift();
        const buyPrice = requiredData.buyPrice;
        const profit = noofpieces*(sellPrice-buyPrice);
        return ctx.db.mutation.createSalesItem({data:{
            ...args.data,
            buyPrice,
            profit,
            supplier:{
                connect:{
                    id:requiredData.supplier.id
                }
            }

        }},info);
      
    },
   

}

module.exports = Mutation;