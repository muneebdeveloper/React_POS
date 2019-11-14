require('dotenv').config({path:'.env'});
const jwt = require('jsonwebtoken');
const {forwardTo} = require('prisma-binding');


const Mutation = {
    createLineItem(parent,args,ctx,info){

        name = args.data.name.toLowerCase();

        return ctx.db.mutation.createLineItem({data:{...args.data,name}},info);
    },
    createCategory(parent,args,ctx,info){

        name = args.data.name.toLowerCase();

        return ctx.db.mutation.createCategory({data:{...args.data,name}},info);
    },
    createProduct(parent,args,ctx,info){

        name = args.data.name.toLowerCase();

        return ctx.db.mutation.createProduct({data:{...args.data,name}},info);
    },
    updateLineItem(parent,args,ctx,info){

        if(args.data.name){
            let name = args.data.name.toLowerCase();
            return ctx.db.mutation.updateLineItem({data:{...args.data,name},where:{...args.where}},info)
        }
        return ctx.db.mutation.updateLineItem({...args},info);
        
    },
    updateCategory(parent,args,ctx,info){

        if(args.data.name){
            
            let name = args.data.name.toLowerCase();
            return ctx.db.mutation.updateCategory({data:{...args.data,name},where:{...args.where}},info)
        }
        return ctx.db.mutation.updateCategory({...args},info);
        
    },
    updateProduct(parent,args,ctx,info){

        if(args.data.name){
            let name = args.data.name.toLowerCase();
            return ctx.db.mutation.updateProduct({data:{...args.data,name},where:{...args.where}},info)
        }
        return ctx.db.mutation.updateProduct({...args},info);
        
    }, 
    createStockItem:forwardTo('db'),
    createSupplier:forwardTo('db'),
    createPaidDetail:forwardTo('db'),
    updateStockItem:forwardTo('db'),
    updateSupplier:forwardTo('db'),
    deleteSupplier:forwardTo('db'), 
    createExpense:forwardTo('db'),
    updateExpense:forwardTo('db'),
    deleteCategory:forwardTo('db'),
    deleteExpense:forwardTo('db'),
    createBarcode:forwardTo('db'),  
    deleteStockItem:forwardTo('db'),
    deleteBarcode:forwardTo('db'),
    deleteExpiry:forwardTo('db'),
    deleteProduct:forwardTo('db'),
    deleteLineItem:forwardTo('db'),
    deleteQuantity:forwardTo('db'),
    updateSettings:forwardTo('db'),
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
                maxAge:1000 * 60 * 60 * 24 * 365,
            }
        );

        return user;

    },

    signout(parent,args,ctx,info){
        ctx.response.clearCookie('token');
        return {message:"Successfully signed out"};
    },

    // async createStockItem(parent,args,ctx,info){

    //     const {data:{sellPrice,wholesalePrice,noofpieces,product:{connect:{id}}}} = args;
    //     let product = await ctx.db.query.product({where:{id}},`{noofpieces}`);
    //     product.noofpieces += noofpieces;
    //     ctx.db.mutation.updateProduct({data:{sellPrice,wholesalePrice,noofpieces:product.noofpieces},where:{id}});

    //     return ctx.db.mutation.createStockItem({data:args.data},info);
    // },
    // async deleteStockItem(parent,args,ctx,info){
    //     const stockItem = await ctx.db.query.stockItem({where:{id:args.where.id}},`{noofpieces product{id}}`);
    //     const productRemove = await ctx.db.mutation.deleteStockItem({where:{id:args.where.id}},info);
    //     let product = await ctx.db.query.product({where:{id:stockItem.product.id}},`{noofpieces stock{sellPrice}}`);
    //     product.noofpieces -= stockItem.noofpieces;
    //     if(product.stock.length > 0){
    //         let requiredObject = product.stock.pop();
    //         ctx.db.mutation.updateProduct({data:{sellPrice:requiredObject.sellPrice,
    //                                             wholesalePrice:requiredObject.wholesalePrice,
    //                                             noofpieces:product.noofpieces},where:{id:stockItem.product.id}});
    //     }else{
    //         ctx.db.mutation.updateProduct({data:{sellPrice:null,wholesalePrice:null,noofpieces:0},where:{id:stockItem.product.id}});
    //     }
    //     return productRemove;

    // },
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

        // Destructuring the args
        let {data:{priceSold,noofpieces,product:{connect:{id}}}} = args;

        // // Checking if the selection is retail but sellPrice isnot given and vice versa 
        // if((type==='retail' && !sellPrice) || (type==='wholesale' && !wholesalePrice)){
        //     throw new Error("price and price type donot match")
        // }

        // Querying product with stockItems and number of pieces
        let product = await ctx.db.query.product({where:{id}},`{stock(orderBy:createdAt_ASC){id badgeNumber createdAt buyPrice noofpieces sellPrice wholesalePrice expiry}}`);

        // Main Logic starts here
        let 
            // mainNoOfPieces = noofpieces,
            checkNoOfPieces,
            profit = 0,
            // productNoOfPiecesCalled = false,
            resDelete,
            resUpdate,
            resRefundId,
            refundArray = [];
        for(let i=0;i<product.stock.length;i++){
            checkNoOfPieces = noofpieces - product.stock[i].noofpieces;
            if(checkNoOfPieces>=0){
                noofpieces -= product.stock[i].noofpieces;
                // if(type==='retail'){
                profit = product.stock[i].noofpieces * (priceSold - product.stock[i].buyPrice) + profit;
                // }else{
                //     profit = product.stock[i].noofpieces * (wholesalePrice - product.stock[i].buyPrice) + profit;
                // }
                
                resDelete = await ctx.db.mutation.deleteStockItem({where:{id:product.stock[i].id}},`{badgeNumber createdAt buyPrice noofpieces sellPrice wholesalePrice expiry}`);
                resRefundId = await ctx.db.mutation.createrefundObject({data:{...resDelete,stockID:product.stock[i].id}},`{id}`);
                refundArray.push(resRefundId);
                // if(i==product.stock.length-1){
                //     // productNoOfPiecesCalled = true;
                //     ctx.db.mutation.updateProduct({data:{sellPrice:null,wholesalePrice:null,noofpieces:0},where:{id}});
                //     break;
                // }
            }else{
                // if(type==='retail'){
                profit = noofpieces * (priceSold - product.stock[i].buyPrice) + profit;
                // }else{
                //     profit = mainNoOfPieces * (wholesalePrice - product.stock[i].buyPrice) + profit;
                // }
                resUpdate = await ctx.db.mutation.updateStockItem(
                            {
                                where:{id:product.stock[i].id},
                                data:{noofpieces:product.stock[i].noofpieces-noofpieces}
                            },
                            `{badgeNumber createdAt buyPrice noofpieces sellPrice wholesalePrice expiry}`
                            );
                resUpdate.noofpieces = noofpieces;
                resRefundId = await ctx.db.mutation.createrefundObject({data:{...resUpdate,stockID:product.stock[i].id}},`{id}`);
                refundArray.push(resRefundId);
                break;
            }
        }
        // if(!productNoOfPiecesCalled){
        //     ctx.db.mutation.updateProduct({data:{noofpieces:product.noofpieces-mainNoOfPieces},where:{id}});
        // }
        

        // Returning the query
        return ctx.db.mutation.createSalesItem({data:{
            ...args.data,
            profit,
            refundCriteria:{
                connect:[...refundArray]
            }
        }},info);
      
    },
    async refundItems(parent,args,ctx,info){

        // Destructuing the args
        let {salesitemID, noofpieces:refundnoofpieces} = args.data;
        
        // Creating variable for the end query of updating salesitem
        let originalRefundQuantity = refundnoofpieces;

        // Querying the salesitems from the given id
        let salesItem =await ctx.db.query.salesItem({where:{id:salesitemID}},`{noofpieces type priceSold profit discount discountUnit refundCriteria{id stockID createdAt badgeNumber noofpieces buyPrice sellPrice wholesalePrice expiry} product{id}}`);

        // Main logic starts here
        let length = salesItem.refundCriteria.length - 1;
        
        for(let i=length;i>=0;i--){

            let {id,stockID,noofpieces,badgeNumber,createdAt,buyPrice,sellPrice,wholesalePrice,expiry} = salesItem.refundCriteria[i];

            let stockItem = await ctx.db.query.stockItem({where:{id:stockID}},`{id noofpieces}`);
    
            if(stockItem){
                ctx.db.mutation.updateStockItem({
                    where:{id:stockItem.id},
                    data:{
                        ...(refundnoofpieces-noofpieces<=0?{noofpieces:stockItem.noofpieces+refundnoofpieces}:{noofpieces:stockItem.noofpieces+noofpieces})
                    }
                },`{id}`);

            }else{
                ctx.db.mutation.createStockItem({
                    data:{
                        id:stockID,
                        ...(refundnoofpieces-noofpieces<=0?{noofpieces:refundnoofpieces}:{noofpieces}),
                        badgeNumber,
                        createdAt,
                        buyPrice,
                        sellPrice,
                        wholesalePrice,
                        expiry,
                        product:{
                            connect:{
                                id:salesItem.product.id
                            }
                        },
                    }
                },`{id}`);

            }
            
            if(salesItem.type=='retail'){
                if(refundnoofpieces-noofpieces<0){
                    salesItem.profit = salesItem.profit - (refundnoofpieces*(salesItem.priceSold-buyPrice));
                }else{
                    salesItem.profit = salesItem.profit - (noofpieces*(salesItem.priceSold-buyPrice));
                }
            }else{
                if(refundnoofpieces-noofpieces<0){
                    salesItem.profit = salesItem.profit - (refundnoofpieces*(salesItem.priceSold-buyPrice));
                }else{
                    salesItem.profit = salesItem.profit - (noofpieces*(salesItem.priceSold-buyPrice));
                }
            }
            
            if(refundnoofpieces-noofpieces<=0){
                if(refundnoofpieces-noofpieces==0){
                    ctx.db.mutation.deleterefundObject({where:{id}},`{id}`);    
                    break;
                }
                ctx.db.mutation.updaterefundObject({where:{id},data:{noofpieces:noofpieces-refundnoofpieces}},`{id}`);               
                break;
            }else{
                ctx.db.mutation.deleterefundObject({where:{id}},`{id}`);
                refundnoofpieces -= noofpieces;
            }

        }
        let refundAmount = (salesItem.priceSold*originalRefundQuantity)-(salesItem.discountUnit * originalRefundQuantity);
        ctx.db.mutation.updateSalesItem(
            {
                data:{
                    noofpieces:salesItem.noofpieces-originalRefundQuantity,
                    profit:salesItem.profit,
                    discount:salesItem.discount-(salesItem.discountUnit*originalRefundQuantity)
                },
                where:{id:salesitemID}
            },
            `{id}`);
        
        return refundAmount;
        

    }

}

module.exports = Mutation;