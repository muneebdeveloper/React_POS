require('dotenv').config({path:'.env'});
const jwt = require('jsonwebtoken');
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

    async signin(parent,args,ctx,info){
        let {username,password} = args.data;
        username = username.toLowerCase();

        const user = await ctx.db.query.user({
            where:{
                username
            }
        })
        if(!user){
            throw new Error("The username doesnot exist")
        }
        if(user.password!==password){
            throw new Error("password isnot correct")
        }
        const token = jwt.sign({userId:user.id},process.env.JWT_SECRET);
        ctx.response.cookie(
            'token',
            token,
            {
                httpOnly:true,
                maxAge:1000 * 60 * 60 * 24 * 365
            }
        );

        return user;

    },

    signout(parent,args,ctx,info){
        ctx.response.clearCookie('token');
        return {message:"Successfully signed out"};
    },

    createStockItem(parent,args,ctx,info){

        const {data:{sellPrice,wholesalePrice,product:{connect:{id}}}} = args;
        ctx.db.mutation.updateProduct({data:{sellPrice,wholesalePrice},where:{id}});

        return ctx.db.mutation.createStockItem({data:args.data},info);
    },
    async deleteStockItem(parent,args,ctx,info){
        const productID = await ctx.db.query.stockItem({where:{id:args.where.id}},`{product{id}}`);
        const productRemove = await ctx.db.mutation.deleteStockItem({where:{id:args.where.id}},info);
        const stockItem = await ctx.db.query.stockItem({where:{id:args.where.id}},`{product{id stock{sellPrice}}}`);
        if(stockItem){
            let requiredObject = stockItem.product.stock.pop();
            ctx.db.mutation.updateProduct({data:{sellPrice:requiredObject.sellPrice,wholesalePrice:requiredObject.wholesalePrice},where:{id:user.product.id}});
        }else{
            ctx.db.mutation.updateProduct({data:{sellPrice:null,wholesalePrice:null},where:{id:productID.product.id}});
        }
        return productRemove;

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